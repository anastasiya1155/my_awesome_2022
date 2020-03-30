package cmd

import (
	"encoding/json"
	"fmt"
	"github.com/desertbit/grumble"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"io/ioutil"
	"log"
	"net/http"
)

func init() {
	App.AddCommand(&grumble.Command{
		Name:      "personal tasks",
		Help:      "show my personal tasks",
		Aliases:   []string{"t"},
		Usage:     "t [OPTIONS]",
		AllowArgs: true,

		Flags: func(f *grumble.Flags) {
			f.Int("l", "limit", 25, "limit")
		},
		Run: func(c *grumble.Context) error {

			res, err := http.Get("https://tranf-ae713.firebaseio.com/todo.json")
			if err != nil {
				log.Fatal(err)
			}
			body, err := ioutil.ReadAll(res.Body)

			res.Body.Close()
			if err != nil {
				log.Fatal(err)
			}

			var generated map[string]Todo
			jsonErr := json.Unmarshal(body, &generated)
			if jsonErr != nil {
				log.Fatal(jsonErr)
			}

			for _, v := range generated {

				fmt.Printf("%s\n", v.Name)
			}

			return nil
		},
	})
}
