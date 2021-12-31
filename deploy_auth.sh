if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

cd auth
GOOS=linux GOARCH=amd64 go build -v ./auth.go

echo "Using env variables:"
echo $PEM_KEY
echo $SERVER_USER
echo $SERVER_ADDRESS

scp -i $PEM_KEY auth $SERVER_USER@$SERVER_ADDRESS:pa2020/auth

ssh -i $PEM_KEY $SERVER_USER@$SERVER_ADDRESS "pm2 restart auth"
