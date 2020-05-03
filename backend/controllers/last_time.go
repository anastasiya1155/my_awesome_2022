package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/middleware"
	"github.com/vova/pa2020/backend/models"
	"net/http"
)

func GetLts(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var lts []models.Lt
	rawQuery := "SELECT * FROM last_time where user_id = ?;"
	db.Raw(rawQuery, middleware.UserInstance(c).ID).Scan(&lts)
	c.JSON(201, lts)
}

func CreateLt(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	lt := models.Lt{}

	if err := c.Bind(&lt); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	lt.UserId = middleware.UserInstance(c).ID

	if err := db.Create(&lt).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, lt)
}

func UpdateLt(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	lt := models.Lt{}

	if db.First(&lt, id).Error != nil {
		content := gin.H{"error": "lt with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&lt); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if !vote(c, lt) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&lt).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, lt)
}

func DeleteLt(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	lt := models.Lt{}

	if db.First(&lt, id).Error != nil {
		content := gin.H{"error": "lt with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}
	if !vote(c, lt) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}
	if err := db.Delete(&lt).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.Writer.WriteHeader(http.StatusNoContent)
}
