package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "backend/db"
	"backend/middleware"
	"backend/models"
	"net/http"
)

func GetWishes(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var wishes []models.Wish
	rawQuery := "SELECT * FROM wish where group_id = ?;"
	db.Raw(rawQuery, middleware.UserInstance(c).WishGroupId).Scan(&wishes)
	c.JSON(200, wishes)
}

func CreateWish(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	wish := models.Wish{}

	if err := c.Bind(&wish); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	wish.UserId = middleware.UserInstance(c).ID
	wish.GroupId = middleware.UserInstance(c).WishGroupId

	if err := db.Create(&wish).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, wish)
}

func UpdateWish(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	wish := models.Wish{}

	if db.First(&wish, id).Error != nil {
		content := gin.H{"error": "wish with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&wish); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, wish) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&wish).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, wish)
}

func DeleteWish(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	wish := models.Wish{}

	if db.First(&wish, id).Error != nil {
		content := gin.H{"error": "wish with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, wish) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&wish).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
