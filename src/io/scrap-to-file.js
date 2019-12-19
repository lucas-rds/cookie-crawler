const fs = require("fs");

const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);

const write = async scrappedPages => {
  const data = scrappedPages.reduce((accumulator, { url, data }) => {
    return { ...accumulator, [url]: data };
  }, {});
  console.log("Writing output.json...");
  await writeFile("output.json", JSON.stringify(data, null, 4));
};

module.exports = {
  write
};
