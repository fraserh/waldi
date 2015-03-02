if [ -z "$1" ]
  then
  echo "usage: ./runner.sh [file]"
  exit
fi

while true
do
  node $1
  gtimeout 60 killall node && node $1
done

