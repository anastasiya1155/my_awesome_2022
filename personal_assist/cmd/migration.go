package cmd

import (
	"fmt"
	"github.com/desertbit/grumble"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"io/ioutil"
	"log"
	"os"
	"sort"
)

type MigrationRecord struct {
	Version string `json:"version"`
}

func init() {
	App.AddCommand(&grumble.Command{
		Name:      "migrate",
		Help:      "database scheme update",
		Usage:     "migreate",
		AllowArgs: true,

		Flags: func(f *grumble.Flags) {
		},
		Run: func(c *grumble.Context) error {

			if os.Getenv("LOCAL") != "1" {
				fmt.Println("please run this command without docker")
				return nil
			}

			dbstr := "vova:vova@tcp(mysql:3306)/m2019?charset=utf8&parseTime=True&loc=Local"

			if os.Getenv("LOCAL") == "1" {
				dbstr = "root:root@tcp(localhost:3308)/m2019?charset=utf8&parseTime=True&loc=Local"
			}

			db, err := gorm.Open("mysql", dbstr)

			if err != nil {
				log.Fatalf("Got error when connect database, the error is '%v'", err)
			}

			lastAppliedMigration := MigrationRecord{}

			db.Raw("select * from migration order by version desc limit 1").Scan(&lastAppliedMigration)
			fmt.Println(lastAppliedMigration)

			f, err := os.Open("../migrations")
			if err != nil {
				log.Fatal(err)
			}

			allFiles, err := f.Readdirnames(100)
			sort.Strings(allFiles)
			indexOfLastMigration := -1

			for in, filename := range allFiles {
				if filename == lastAppliedMigration.Version {
					indexOfLastMigration = in
				}
			}

			for i, filename := range allFiles {
				if i > indexOfLastMigration {
					dat, _ := ioutil.ReadFile(fmt.Sprintf("../migrations/%s", filename))
					db.Exec(string(dat))
					db.Exec(fmt.Sprintf("INSERT INTO `m2019`.`migration` (`version`) VALUES ('%s');", filename))
				}
			}
			if err := f.Close(); err != nil {
				log.Fatal(err)
			}
			return nil
		},
	})
}
