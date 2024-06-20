import * as net from "net";
import commendParser from "./handlers/commend.parser";

// memory database
const memory: Map<string, string> = new Map();

const server: net.Server = net.createServer((connection: net.Socket) => {
    connection.on("data", (data: Buffer) => {
        const commands: string[] = commendParser(data);

        // use regex to parse the command
        if (commands[0].match(/ping/gim)) return connection.write("+PONG\r\n");
        if (commands[0].match(/echo/gim)) return connection.write(`+${commands[1]}\r\n`);
        if (commands[0].match(/set/gim)) {
            memory.set(commands[1], commands[2]);
            return connection.write("+OK\r\n");
        }
        if (commands[0].match(/get/gim)) {
            const value: string | undefined = memory.get(commands[1]);
            return connection.write(`+${value}\r\n`);
        }

        connection.write("+ERROR\r\n");
    });

    connection.on("end", () => {
        connection.end();
    });
});

server.listen(6379, "127.0.0.1");
