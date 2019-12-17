# cookie-crawler
Cookie crawler using puppeteer


Usage

``` 
    $ node app.js --delay 1000 https://google.com https://github.com/
   Or
    $ node app-cluster.js --delay 1000 https://google.com https://github.com/
   Or
    $ node --experimental-worker app-worker.js --delay 1000 https://google.com https://github.com/
```

Options

 ```--delay Time waited in the page before fetching the cookies```
