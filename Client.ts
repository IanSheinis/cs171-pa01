import * as net from "net"; // Socket library
import { nw_port, utcTimeFn, utcTimeFnNumber} from "./config";
import { Clock } from "./clock";
import * as fs from 'fs';

// Command line arguments, and printing every second was done by grok
// Used claude to check for errors and help create csv
// Default values
let d = 10;
let epsilon_max = 0.1;
let rho = 1e-2;

// Parse command-line arguments
const args = process.argv.slice(2); // Skip node and script name
for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const value = args[i + 1];

  switch (key) {
    case "--d":
      d = parseInt(value);
      break;
    case "--epsilon_max":
      epsilon_max = parseFloat(value);
      break;
    case "--rho":
      rho = parseFloat(value);
      break;
  }
}

/**
 * Send request to time_server
 * @returns servertime and round trip time 
 */
async function sendRequest(): Promise<{ serverTime: number, rtt: number }> {
  return new Promise((resolve, reject) => {
    const T0 = utcTimeFnNumber();  // Send time
    const client = new net.Socket();
    
    // Send to nwServer arbitrary msg
    client.connect({ port: nw_port, host: "localhost" }, () => {
      const message = JSON.stringify({ type: "time_req" });
      client.write(message);
    });
    
    // Parse nw server msg, returning servertime and round trip time
    client.on("data", (data) => {
      const T1 = utcTimeFnNumber();  
      const response = JSON.parse(data.toString("utf-8"));
      const serverTime = parseFloat(response.time_server);
      const rtt = T1 - T0;  
      
      client.destroy();
      resolve({ serverTime, rtt });
    });
    
    client.on("error", reject);
  });
}

function writeRow(actualTime: string, localTime: string) {
    fs.appendFileSync('output.csv', `${actualTime},${localTime}\n`);
}

async function main(){
    const localTimer = new Clock(rho) // Wrapper for local clock functionality
    const start_time = utcTimeFnNumber();
    const end_time = start_time + d;
    let lastPrintTime = Math.floor(start_time);  

    const syncInterval = epsilon_max / (2 * rho); // Eq from lecture
    let lastSyncTime = start_time;

    fs.writeFileSync('output.csv', 'actual_time,local_time\n');

    // Initial synchronization
    const { serverTime: initialTime, rtt: initialRtt } = await sendRequest();
    localTimer.setTime(initialTime + initialRtt / 2);

    while (utcTimeFnNumber() <= end_time){
        const currentTime = utcTimeFnNumber();
        
        // Check if it's time to synchronize
        if (currentTime - lastSyncTime >= syncInterval) {
            const { serverTime, rtt } = await sendRequest();
            const estimatedServerTime = serverTime + rtt / 2;
            localTimer.setTime(estimatedServerTime);
            lastSyncTime = currentTime;
        }

        // Write to CSV once per second
        if (Math.floor(currentTime) > lastPrintTime) {
            writeRow(utcTimeFn(), localTimer.getTime().toFixed(3));
            lastPrintTime = Math.floor(currentTime);
        }
        
    }
}

main().catch(console.error);