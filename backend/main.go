package main

import (
	"github.com/patrickmn/go-cache"
	"github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/server"
	"os"
	"strconv"
	"time"
)

// main ...
func main() {
	database := db.Connect()
	c := cache.New(10*time.Minute, 15*time.Minute)
	s := server.Setup(database, c)
	port := "8888"

	if p := os.Getenv("PORT"); p != "" {
		if _, err := strconv.Atoi(p); err == nil {
			port = p
		}
	}

// 	if os.Getenv("LOCAL") == "1" {
		s.Run(":" + port)
// 	} else {
// 		s.RunTLS(":"+port, "cert.pem", "privkey.pem")
// 	}
}
