package controllers

import (
	"github.com/vova/pa2020/backend/middleware"
	"net/http"

	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/helper"
	"github.com/vova/pa2020/backend/models"
	"github.com/vova/pa2020/backend/version"

	"github.com/gin-gonic/gin"
)

// todo: vote
func GetLabels(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var labels []models.Label
	rawQuery := "SELECT * FROM labels where user_id = ?;"
	db.Raw(rawQuery, middleware.UserInstance(c).ID).Scan(&labels)
	c.JSON(201, labels)
}

func GetLabel(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	parameter, err := dbpkg.NewParameter(c, models.Label{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	label := models.Label{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Label{}, fields)

	if err := db.Select(queryFields).First(&label, id).Error; err != nil {
		content := gin.H{"error": "label with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, label) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	fieldMap, err := helper.FieldToMap(label, fields)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	if _, ok := c.GetQuery("pretty"); ok {
		c.IndentedJSON(200, fieldMap)
	} else {
		c.JSON(200, fieldMap)
	}
}

func CreateLabel(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	label := models.Label{}

	if err := c.Bind(&label); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, label) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Create(&label).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.JSON(201, label)
}

func UpdateLabel(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	label := models.Label{}

	if db.First(&label, id).Error != nil {
		content := gin.H{"error": "label with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&label); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, label) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&label).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, label)
}

func DeleteLabel(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	label := models.Label{}

	if db.First(&label, id).Error != nil {
		content := gin.H{"error": "label with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}
	if !vote(c, label) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&label).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
