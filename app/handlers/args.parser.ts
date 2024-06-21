function argsParser(args: string[]): Map<string, string> {
    try {
        const map: Map<string, string> = new Map();

        if (args.length % 2 !== 0)
            throw new Error('Invalid number of arguments');

        for (let i = 0; i < args.length; i=i+2)
            map.set(args[i].replace('--', ''), args[i+1]);

        return map;
    } catch (err) {
        console.error('Error in args parser', err)
    }
}

export default argsParser;
