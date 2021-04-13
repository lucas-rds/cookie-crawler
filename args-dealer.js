const minimist = require("minimist");

const dealWithArgs = () => {
  try {
    const args = minimist(process.argv.slice(2));
    const urls = args._.filter(param => param && param.includes("http"));
    if (args.help || args.h || !urls.length) {
      throw new Error();
    }
    return {
      urls: urls,
      delay: args.delay || 0,
      domain: args.domain.trim(),
      username: args.username,
      password: args.password,
      groupName: args.groupName,
    };
  } catch (error) {
    console.error(error);
    console.log(`
      Usage
        $ node app.js --domain google.com --delay 1000 https://google.com https://github.com/
        Or
        $ node app-cluster.js --domain google.com --delay 1000 https://google.com https://github.com/
        Or
        $ node --experimental-worker app-worker.js --domain google.com --delay 1000 https://google.com https://github.com/

      Options
        --delay Time waited in the page before fetching the cookies`);

    return process.exit(0);
  }
};

module.exports = dealWithArgs;
