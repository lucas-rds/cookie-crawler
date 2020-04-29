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

function generate(number, quantity = 2, depth = 2, index = 0) {
  const newNum = number * quantity;
  console.log(number, newNum);
  range(1, newNum).forEach(value => {
    const childrenFrom = value * quantity - quantity + 1;
    const childrenTo = value * quantity;
    const templateString =
      "frontend-" + number + "-" + value + "-${index}=${index}";
    fs.writeFileSync(
      `${__dirname}/dist/${number}-${value}.html`,
      `
<html>
  <head>
      <script> 
        let index = 0;
        const interval = setInterval(() => {
          console.log("Setting up cookie with time:", \`frontend-banner-${index}\`);
          document.cookie =\`${templateString}\`;
          index++;
        }, 1000);
      </script>
  </head>
  <body>
      ${range(childrenFrom, childrenTo).map(
        x => `<a href="${newNum}-${x}.html">${newNum}-${x}</a>`
      )}
  </body>
</html>
  `
    );
  });
  if (index < depth) {
    generate(newNum, quantity, depth, ++index);
  }
}

rimraf.sync(`${__dirname}/dist/`);
if (!fs.existsSync(`${__dirname}/dist/`)) {
  fs.mkdirSync(`${__dirname}/dist/`);
}

generate(1, 5, 3);

const port = 3000;
var app = express();
app.use(express.static(__dirname + "/dist"));
app.listen(port, function() {
  console.log(`http://localhost:${port}`);
});
