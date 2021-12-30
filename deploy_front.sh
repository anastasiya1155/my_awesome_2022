if [ -f frontend/.env ]
then
  export $(cat frontend/.env | sed 's/#.*//g' | xargs)
fi

cd frontend
npm run build

echo "Using env variables:"
echo $PEM_KEY
echo $SERVER_USER
echo $SERVER_ADDRESS

scp -r -i $PEM_KEY build/ $SERVER_USER@$SERVER_ADDRESS:pa2020/frontend

ssh sjh "pm2 restart front"
