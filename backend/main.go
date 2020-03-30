package main

import (
	"github.com/vova/m2019/backend/db"
	"github.com/vova/m2019/backend/server"
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

	s.Run(":" + port)
}
