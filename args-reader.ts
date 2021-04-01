const minimist = require("minimist");

export type Args = {
  delay: number
  urls: string[]
} | never

export class ArgsReader {
  read(): Args {
    try {
      const args = minimist(process.argv.slice(2));
      const urls = args._.filter(arg => arg && arg.includes("http"));
      if (args.help || args.h || !urls.length) {
        return this.showHelpAndExit();
      }
      return { urls, delay: Number(args.delay) || 0 };
    } catch (error) {
      console.error(error);
      return this.showHelpAndExit();
    }
  };

  showHelpAndExit() {
    console.log(`
    Usage
      $ node app.js --delay 1000 https://google.com https://github.com/
      Or
      $ node app-cluster.js --delay 1000 https://google.com https://github.com/
      Or
      $ node --experimental-worker app-worker.js --delay 1000 https://google.com https://github.com/

    Options
      --delay Time waited in the page before fetching the cookies`);

    return process.exit(0);
  }
}
