import * as net from "net"; // Socket library
import { time_port, nw_port} from "./config";

/**
 * 
 * @param min minimum timeout in ms
 * @param max maximum timeout in ms
 */
function randInt(min: number, max: number): number{
    const delay = min + Math.random() * (max - min);
    return delay
}

function initiateClockServer() {
    const server = net.createServer(function(socket) {
        console.log("Network server: connection from", socket.remoteAddress, "port", socket.remotePort)

        socket.on("data", (buffer) => {
            console.log("Request from", socket.remoteAddress, "port", socket.remotePort)
            
            // Send to time server logic
            const client = new net.Socket()
            const delay = randInt(0.1,0.5);
            client.connect({ port: time_port, host: "localhost"}, 
                () => {
                    setTimeout(
                        () => client.write(buffer),
                        delay
                )}
            )
            client.on("data", (data) => {            
                const delay = randInt(0.1,0.5);
                const jsonResponse = {
                    'client_request': buffer.toString("utf-8"),
                    'time_server': data.toString("utf-8")
                    
                };
                setTimeout(
                    () => socket.write(JSON.stringify(jsonResponse)),
                    delay
                )
                client.destroy()
            })

        })

        socket.on("end", () => {
            console.log("Closed", socket.remoteAddress, "port", socket.remotePort)
        })
    });

    server.listen(nw_port, function() {
        console.log("Socket is listening...");
    });
}

if (require.main === module) {
    // Trigger the Clock Server    
    initiateClockServer();
}