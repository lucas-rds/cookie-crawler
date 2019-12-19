// index.js
// run with node --experimental-worker index.js on Node.js 10.x
const { Worker } = require("worker_threads");

function runService(workerData) {
  return new Promise((resolve, reject) => {

    const worker = new Worker("./service.js", { workerData });

    worker.on("message", msg => {
      console.log(msg);
      resolve();
    });
    
    worker.on("error", () => {
      console.log("rejected");
      reject();
    });

    worker.on("exit", code => {
      reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function run() {
  await runService("world");
}

run().catch(err => console.error(err));
