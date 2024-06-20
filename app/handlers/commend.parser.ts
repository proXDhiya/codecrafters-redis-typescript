function commendParser(command: Buffer): string[] {
    try {
        const rowCommends: string[] = command.toString().split("\r\n");
        const commands: string[] = [];

        for (let i = 2; i < rowCommends.length; i += 2)
            commands.push(rowCommends[i]);

        return commands;
    } catch (err) {
        console.error('Error parsing command: ', err);
        return ["ERROR"]
    }
}

export default commendParser;
