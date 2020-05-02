package controllers

import (
	"fmt"
	"github.com/vova/pa2020/backend/middleware"
	"net/http"
	"strconv"
	"time"

	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/helper"
	"github.com/vova/pa2020/backend/models"
	"github.com/vova/pa2020/backend/version"

	"github.com/gin-gonic/gin"
)

// voted
func GetTasksInprogressForUser(c *gin.Context) {
	db := dbpkg.DBInstance(c)

	tasks := []models.Task{}

	rawQuery :=
		` SELECT t.* FROM tasks t
		  join projects p on (t.project_id = p.id and p.user_id = ?)
		  where t.status = 'in_progress';
		`
	db.Raw(rawQuery, middleware.UserInstance(c).ID).Scan(&tasks)

	c.JSON(201, tasks)
}

// voted
func GetTasksByProject(c *gin.Context) {
	db := dbpkg.DBInstance(c)

	projectId, err := strconv.Atoi(c.Params.ByName("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	vote(c, models.Task{ProjectId: projectId})
	tasks := []models.Task{}

	rawQuery := "SELECT * FROM tasks  where project_id = ? order by priority desc"
	db.Raw(rawQuery, projectId).Scan(&tasks)

	c.JSON(201, tasks)
}

// voted
func GetTask(c *gin.Context) {

	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user := middleware.UserInstance(c)
	fmt.Println(user)

	db := dbpkg.DBInstance(c)
	parameter, err := dbpkg.NewParameter(c, models.Task{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	task := models.Task{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Task{}, fields)

	if err := db.Select(queryFields).First(&task, id).Error; err != nil {
		content := gin.H{"error": "task with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, task) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	fieldMap, err := helper.FieldToMap(task, fields)
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

// voted
func CreateTask(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	task := models.Task{}
	task.CreatedAt = time.Now()

	if err := c.Bind(&task); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	fmt.Print(task)
	if !vote(c, task) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Create(&task).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, task)
}

// voted
func UpdateTask(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	task := models.Task{}

	if db.First(&task, id).Error != nil {
		content := gin.H{"error": "task with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, task) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := c.Bind(&task); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&task).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.JSON(200, task)
}

// voted
func DeleteTask(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	task := models.Task{}

	if db.First(&task, id).Error != nil {
		content := gin.H{"error": "task with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, task) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&task).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
