FROM golang:1.13
WORKDIR /go/src/github.com/vova/pa2020/auth/
COPY . .
RUN go get -d -v ./...
RUN go install -v ./...
RUN go build -o auth .
EXPOSE 18401
CMD ["./auth"]
