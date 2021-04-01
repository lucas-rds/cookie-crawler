const { Worker } = require("worker_threads");
const dealWithArgs = require("./args-reader");

const { delay, urls } = dealWithArgs();

urls.forEach(url => {
  const worker = new Worker("./app-service-worker.js", {
    workerData: { delay, urls: [url] }
  });
  worker.on("message", message => console.log(message));
  worker.postMessage("Starting new thread worker");
});
