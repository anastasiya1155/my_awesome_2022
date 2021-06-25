package main

import (
	"github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/server"
	"os"
	"strconv"
)

// main ...
func main() {
	database := db.Connect()

	s := server.Setup(database)
	port := "8888"

	if p := os.Getenv("PORT"); p != "" {
		if _, err := strconv.Atoi(p); err == nil {
			port = p
		}
	}

	if os.Getenv("LOCAL") == "1" {
		s.Run(":" + port)
	} else {
		s.RunTLS(":"+port, "../frontend/greenlock.d/live/pa2021.solop.cc/cert.pem", "../frontend/greenlock.d/live/pa2021.solop.cc/privkey.pem")
	}
}
