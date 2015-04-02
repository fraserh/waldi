if [ -z "$1" ]
  then
  echo "usage: ./runner.sh (coles|woolworths)"
  exit
fi

node fillQueue.js $1
./zombieCrawl.sh "$1.js"
