const minimist = require("minimist");

const dealWithArgs = () => {
  try {
    const args = minimist(process.argv.slice(2));
    const urls = args._.filter(param => param && param.includes("http"));
    if (args.help || args.h || !urls.length) {
      throw new Error();
    }
    return { urls: urls, delay: args.delay || 0 };
  } catch (error) {
    console.error(error);
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
};

module.exports = dealWithArgs;