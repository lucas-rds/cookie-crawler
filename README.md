# cookie-crawler
Cookie crawler using puppeteer


Usage

``` 
    $ tsc && node dist/app.js --delay 1000 https://google.com https://github.com/
   Or
    $ tsc && node dist/app-cluster.js --delay 1000 https://google.com https://github.com/
   Or
    $ tsc && node --experimental-worker dist/app-worker.js --delay 1000 https://google.com https://github.com/
```

Options

 ```--delay Time waited in the page before fetching the cookies```
