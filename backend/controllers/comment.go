package controllers

import (
	"net/http"
	"time"

	dbpkg "backend/db"
	"backend/models"
	"backend/version"

	"github.com/gin-gonic/gin"
)

// voted
func CreateComment(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	comment := models.Comment{}
	comment.Date = time.Now()

	if err := c.Bind(&comment); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if !vote(c, comment) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Create(&comment).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, comment)
}

// voted
func UpdateComment(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	comment := models.Comment{}

	if db.First(&comment, id).Error != nil {
		content := gin.H{"error": "comment with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&comment); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if !vote(c, comment) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&comment).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.JSON(200, comment)
}

// voted
func DeleteComment(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	comment := models.Comment{}

	if db.First(&comment, id).Error != nil {
		content := gin.H{"error": "comment with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}
	if !vote(c, comment) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&comment).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
