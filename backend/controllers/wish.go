package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "github.com/vova/m2019/backend/db"
	"github.com/vova/m2019/backend/helper"
	"github.com/vova/m2019/backend/models"
	"net/http"
)

func GetWishes(c *gin.Context) { c.JSON(200, "list") }

func CreateWish(c *gin.Context) { c.JSON(200, "post") }
func UpdateWish(c *gin.Context) { c.JSON(200, "put") }

func DeleteWish(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	task := models.Wish{}

	if db.First(&task, id).Error != nil {
		content := gin.H{"error": "wish with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := db.Delete(&task).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}

func GetWish(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	parameter, err := dbpkg.NewParameter(c, models.Task{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	task := models.Wish{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Wish{}, fields)

	if err := db.Select(queryFields).First(&task, id).Error; err != nil {
		content := gin.H{"error": "task with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	fieldMap, err := helper.FieldToMap(task, fields)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if _, ok := c.GetQuery("pretty"); ok {
		c.IndentedJSON(200, fieldMap)
	} else {
		c.JSON(200, fieldMap)
	}
}
