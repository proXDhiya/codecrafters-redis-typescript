import * as net from "net";
import commendParser from "./handlers/commend.parser";

// memory database
const memory: Map<string, string> = new Map();

const server: net.Server = net.createServer((connection: net.Socket) => {
    connection.on("data", (data: Buffer) => {
        const commands: string[] = commendParser(data);

        // use regex to parse the command
        if (commands[0].match(/PING/gim)) return connection.write("+PONG\r\n");
        if (commands[0].match(/ECHO/gim)) return connection.write(`+${commands[1]}\r\n`);
        if (commands[0].match(/SET/gim)) {
            memory.set(commands[1], commands[2]);

            if (commands[3] && commands[3].match(/EX|PX/gim)) {
                const expire: number = parseInt(commands[4]) || 0;
                const time: number = commands[3].match(/EX/gim) ? expire * 1000 : expire;
                setTimeout(() => memory.delete(commands[1]), time);
            }

            return connection.write("+OK\r\n");
        }
        if (commands[0].match(/get/gim)) {
            const value: string | undefined = memory.get(commands[1]);
            const response: string = value ? `+${value}\r\n` : "$-1\r\n";
            return connection.write(response);
        }

        connection.write("+ERROR\r\n");
    });

    connection.on("end", () => {
        connection.end();
    });
});

server.listen(6379, "127.0.0.1");
