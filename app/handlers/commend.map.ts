import * as net from "net";

function commendMap(con: net.Socket, com: string[], memory: Map<string, string>) {
    try {
        if (com[0].match(/PING/gim)) return con.write("+PONG\r\n");
        if (com[0].match(/ECHO/gim)) return con.write(`+${com[1]}\r\n`);
        if (com[0].match(/SET/gim)) {
            memory.set(com[1], com[2]);

            if (com[3] && com[3].match(/EX|PX/gim)) {
                const expire: number = parseInt(com[4]) || 0;
                const time: number = com[3].match(/EX/gim) ? expire * 1000 : expire;
                setTimeout(() => memory.delete(com[1]), time);
            }

            return con.write("+OK\r\n");
        }
        if (com[0].match(/get/gim)) {
            const value: string | undefined = memory.get(com[1]);
            const response: string = value ? `+${value}\r\n` : "$-1\r\n";
            return con.write(response);
        }

        return con.write("+ERROR\r\n");
    } catch (err) {
        console.error('Error in commend map', err)
        con.write(`-ERR ${err.message}\r\n`);
    }
}

export default commendMap;
