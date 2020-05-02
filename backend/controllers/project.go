package controllers

import (
	"github.com/vova/pa2020/backend/middleware"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/helper"
	"github.com/vova/pa2020/backend/models"
)

// todo: vote
func GetProjects(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var projects []models.Project
	rawQuery := "SELECT * FROM projects where user_id = ? order by priority;"
	db.Raw(rawQuery, middleware.UserInstance(c).ID).Scan(&projects)
	c.JSON(201, projects)
}
func GetProject(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	parameter, err := dbpkg.NewParameter(c, models.Project{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	project := models.Project{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Project{}, fields)

	if err := db.Select(queryFields).First(&project, id).Error; err != nil {
		content := gin.H{"error": "project with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, project) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	fieldMap, err := helper.FieldToMap(project, fields)
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
func CreateProject(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	project := models.Project{}

	if err := c.Bind(&project); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, project) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	project.CreatedAt = time.Now()
	if err := db.Create(&project).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, project)
}
func UpdateProject(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	project := models.Project{}

	if db.First(&project, id).Error != nil {
		content := gin.H{"error": "project with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&project); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, project) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&project).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, project)
}
func DeleteProject(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	project := models.Project{}

	if db.First(&project, id).Error != nil {
		content := gin.H{"error": "project with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, project) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&project).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
