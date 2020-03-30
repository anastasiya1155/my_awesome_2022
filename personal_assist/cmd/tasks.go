package cmd

import (
	"fmt"
	"github.com/desertbit/grumble"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"log"
)

type Task struct {
	ID   int `gorm:"primary_key"`
	Body string
	Done bool
}

func init() {
	App.AddCommand(&grumble.Command{
		Name:      "tasks",
		Help:      "show tasks",
		Aliases:   []string{"t"},
		Usage:     "tasks [OPTIONS]",
		AllowArgs: true,

		Flags: func(f *grumble.Flags) {
			f.Int("l", "limit", 25, "limit")
		},
		Run: func(c *grumble.Context) error {

			db, err := gorm.Open("mysql", "vova:vova@tcp(mysql:3306)/m2019?charset=utf8&parseTime=True&loc=Local")
			//db, err := gorm.Open("mysql", "db")

			if err != nil {
				log.Fatalf("Got error when connect database, the error is '%v'", err)
			}

			task := Task{}

			db.First(&task)
			//fmt.Println(post)

			fmt.Println(task)

			return nil
		},
	})
}
