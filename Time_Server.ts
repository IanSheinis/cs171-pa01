import * as net from "net"; // Socket library
import { time_port, nw_port, utcTimeFn} from "./config";
/**
 * Got from https://www.geeksforgeeks.org/dsa/cristians-algorithm/
 * https://cs.lmu.edu/~ray/notes/jsnetexamples/
 * https://nodejs.org/api/stream.html#writableendchunk-encoding-callback
 *  */ 


// function used to initiate the Clock Server
function initiateClockServer() {
    const server = net.createServer(function(socket) {
        console.log("Time server: connection from", socket.remoteAddress, "port", socket.remotePort)

        socket.on("data", (buffer) => {
            console.log("Request from", socket.remoteAddress, "port", socket.remotePort)
            socket.write(utcTimeFn());
        })
        // Close the socket with the client process and send one final msg
        socket.on("end", () => {
            console.log("Closed", socket.remoteAddress, "port", socket.remotePort)
        })
    });

    server.listen(time_port, function() {
        console.log("Socket is listening...");
    });
}

if (require.main === module) {
    // Trigger the Clock Server    
    initiateClockServer();
}