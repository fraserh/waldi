Rough steps

1. Install and run beanstalkd
2. Install phantomjs
3. Fill the beanstalk queue
4. Run with `./runner.sh coles.js` to crawl the coles URLs

# 1.
Go to their website

# 2.
Go to their website

# 3.

Note that initially you'll want to uncomment line 18

    fillQueue(startCrawling);

and comment out the line following,

    startCrawling();

Then run the program with `node coles.js`, and you'll see output like

    queue is full
    crawling...
    get nexturl
    Starting to crawl...
    End
    loading http://shop.coles.com.au/online/national/bread-bakery/bread-bakery/#pageNumber=1&currentPageSize=100

This means that our beanstalk queue has been filled, and we're ready to run the crawler for a long period of time. Immediately, you need to hit Control + C to stop the program. 
# 4.

Then go back into the file, and re-comment line 18, and uncomment `startCrawling()`, so the file will be back in its initial state. (At some point we should break out the queue filler and the rest of the app—it'd take like 5 minutes to do I think.)

Due to weird memory leaks in phantom js, we've had to set up an auto-restart for the crawler. So if you want to run the crawler for long periods of time, use the shell script `runner.sh`, which is executed like

    ./runner.sh coles.js

where coles.js is the crawler file to run.
