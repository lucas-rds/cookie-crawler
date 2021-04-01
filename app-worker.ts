import { Worker } from 'worker_threads';
import { Args, ArgsReader } from './args-reader';

const { delay, urls }: Args = new ArgsReader().read();

urls.forEach(url => {
  const worker = new Worker("./app-service-worker.js", {
    workerData: { delay, urls: [url] }
  });
  worker.on("message", message => console.log(message));
  worker.postMessage("Starting new thread worker");
});
