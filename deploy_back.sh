if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

cd backend
GOOS=linux GOARCH=amd64 go build -v ./main.go

echo "Using env variables:"
echo $PEM_KEY
echo $SERVER_USER
echo $SERVER_ADDRESS

scp -i $PEM_KEY main $SERVER_USER@$SERVER_ADDRESS:pa2020/backend

ssh sjh "pm2 restart back"
