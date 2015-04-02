if [ -z "$1" ]
  then
  echo "usage: ./zombieCrawl.sh crawlerFile.js"
  exit
fi


while true
do
  node $1
  gtimeout 60 killall node && node $1
done
