import * as net from "net";
import commendParser from "./handlers/commend.parser";
import commendMap from "./handlers/commend.map";
import argsParser from "./handlers/args.parser";

// args parser
const args = argsParser(process.argv.slice(2));

// memory database
const memory: Map<string, string> = new Map();

const server: net.Server = net.createServer((connection: net.Socket) => {
    connection.on("data", (data: Buffer) => {
        const commands: string[] = commendParser(data);
        return commendMap(connection, commands, memory, args);
    });

    connection.on("end", () => {
        connection.end();
    });
});

server.listen(6379, "127.0.0.1");
