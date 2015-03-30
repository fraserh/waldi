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

Fill the beanstalkd queue.

Start beanstalkd with `beanstalkd`, which will run it on 127.0.0.1 on port 11300 by default.

Then run `node fillQueue.js (coles|woolworths)` to fill the queue with urls for those stores.

# 4.

Due to weird memory leaks in phantom js, we've had to set up an auto-restart for the crawler. So if you want to run the crawler for long periods of time, use the shell script `runner.sh`, which is executed like

    ./runner.sh coles.js

where `coles.js` is the crawler file to run.
