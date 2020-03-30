package db

import (
	"log"
	"os"
	"strings"

	"github.com/vova/m2019/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/serenize/snaker"
)

func Connect() *gorm.DB {

	dbstr := "vova:vova@tcp(mysql:3306)/m2019?charset=utf8&parseTime=True&loc=Local"

	if os.Getenv("LOCAL") == "1" {
		dbstr = "root:root@tcp(localhost:3308)/m2019?charset=utf8&parseTime=True&loc=Local"
	}

	db, err := gorm.Open("mysql", dbstr)
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	}

	db.LogMode(false)

	if gin.IsDebugging() {
		db.LogMode(true)
	}

	if os.Getenv("AUTOMIGRATE") == "1" {
		db.AutoMigrate(
			&models.Comment{},
			&models.Label{},
			&models.Pin{},
			&models.Post{},
			&models.Task{},
		)
	}

	return db
}

func DBInstance(c *gin.Context) *gorm.DB {
	return c.MustGet("DB").(*gorm.DB)
}

func (self *Parameter) SetPreloads(db *gorm.DB) *gorm.DB {
	if self.Preloads == "" {
		return db
	}

	for _, preload := range strings.Split(self.Preloads, ",") {
		var a []string

		for _, s := range strings.Split(preload, ".") {
			a = append(a, snaker.SnakeToCamel(s))
		}

		db = db.Preload(strings.Join(a, "."))
	}

	return db
}
