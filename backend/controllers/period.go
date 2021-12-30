package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "backend/db"
	"backend/middleware"
	"backend/models"
	"net/http"
)

func GetPeriods(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var periods []models.Period
	rawQuery := "SELECT * FROM periods where user_id = ?;"
	db.Raw(rawQuery, middleware.UserInstance(c).ID).Scan(&periods)
	c.JSON(201, periods)
}

func CreatePeriod(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	period := models.Period{}

	if err := c.Bind(&period); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	period.UserId = middleware.UserInstance(c).ID

	if err := db.Create(&period).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, period)
}

func UpdatePeriod(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	period := models.Period{}

	if db.First(&period, id).Error != nil {
		content := gin.H{"error": "period with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&period); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, period) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&period).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, period)
}

func DeletePeriod(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	period := models.Period{}

	if db.First(&period, id).Error != nil {
		content := gin.H{"error": "period with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, period) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&period).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
