package cmd

import (
	"fmt"
	"github.com/desertbit/grumble"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"log"
	"os"
)

type Post struct {
	ID   int       `gorm:"primary_key"`
	Date time.Time `sql:"type:date;"time_format:"2006-01-02"`
	Body string    `sql:"type:text"`
}

func init() {
	App.AddCommand(&grumble.Command{
		Name:      "recent",
		Help:      "show recent posts",
		Usage:     "recent [OPTIONS]",
		AllowArgs: true,

		Flags: func(f *grumble.Flags) {
			f.Int("l", "limit", 25, "limit")
		},
		Run: func(c *grumble.Context) error {

			dbstr := "vova:vova@tcp(mysql:3306)/m2019?charset=utf8&parseTime=True&loc=Local"

			if os.Getenv("LOCAL") == "1" {
				dbstr = "root:root@tcp(localhost:3308)/m2019?charset=utf8&parseTime=True&loc=Local"
			}

			db, err := gorm.Open("mysql", dbstr)
			if err != nil {
				log.Fatalf("Got error when connect database, the error is '%v'", err)
			}

			post := Post{}

			db.First(&post)
			//fmt.Println(post)

			datestr := post.Date.Format("2006-01-02" + " » ")
			c.App.SetPrompt(datestr)
			fmt.Printf(post.Body)

			return nil
		},
	})
}
