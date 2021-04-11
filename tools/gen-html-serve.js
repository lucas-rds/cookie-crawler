const fs = require("fs");
const express = require("express");
const rimraf = require("rimraf");

const range = (from, to) => {
  const array = [];
  for (let index = from; index <= to; index++) {
    array.push(index);
  }
  return array;
};

function generate(name, childName) {

  range(1, 20).forEach(n => {
    const inlineCookieString = `inline-cookie-${name}-${n}=true`;
    const runtimeCookieString = "frontend-" + name + "-" + n + "-${runtimeIndex}=${runtimeIndex}";
    fs.writeFileSync(
      `${__dirname}/dist/${name}-${n}.html`,
      `
<html>
  <head>
      <script>
        document.cookie=\`${inlineCookieString}\`;
        let runtimeIndex = 0;
        const interval = setInterval(() => {
          console.log("Setting up cookie with time:", \`frontend-banner-${name}\`);
          document.cookie=\`${runtimeCookieString}\`;
          runtimeIndex++;
        }, 1000);
      </script>
  </head>
  <body>
      ${range(1, 20).map(
        x => `<a href="${childName}-${x}.html">${childName}-${x}</a><br/>`
      )}
  </body>
</html>
  `
    );
  });
}

rimraf.sync(`${__dirname}/dist/`);
if (!fs.existsSync(`${__dirname}/dist/`)) {
  fs.mkdirSync(`${__dirname}/dist/`);
}

generate("A", "B");
generate("B", "C");
generate("C", "D");
generate("D", "A");

const port = 3000;
var app = express();
app.use(express.static(__dirname + "/dist"));
app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});
