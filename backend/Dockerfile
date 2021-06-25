FROM golang:1.13
WORKDIR /go/src/github.com/vova/pa2020/backend/
COPY . .
RUN go get -d -v ./...
RUN go install -v ./...
RUN go build -o main .
EXPOSE 8888
CMD ["./main"]
