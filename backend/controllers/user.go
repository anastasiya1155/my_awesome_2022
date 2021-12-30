package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "backend/db"
	"backend/middleware"
)

func GetUser(c *gin.Context) {
	c.JSON(200, middleware.UserInstance(c))
}

func UpdateUser(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	user := middleware.UserInstance(c)

	if err := c.Bind(&user); err != nil {
  		c.JSON(400, gin.H{"error": err.Error()})
  		return
  	}

	if err := db.Save(&user).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, user)
}
