package controllers

import (
	"encoding/json"
	"net/http"

	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/helper"
	"github.com/vova/pa2020/backend/models"
	"github.com/vova/pa2020/backend/version"

	"github.com/gin-gonic/gin"
)

// todo: rename all task
func GetLts(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	parameter, err := dbpkg.NewParameter(c, models.Lt{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db, err = parameter.Paginate(db)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	db = parameter.SortRecords(db)
	db = parameter.FilterFields(db)
	lts := []models.Lt{}
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Lt{}, fields)

	if err := db.Select(queryFields).Find(&lts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	index := 0

	if len(lts) > 0 {
		index = int(lts[len(lts)-1].ID)
	}

	if err := parameter.SetHeaderLink(c, index); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	if _, ok := c.GetQuery("stream"); ok {
		enc := json.NewEncoder(c.Writer)
		c.Status(200)

		for _, lt := range lts {
			fieldMap, err := helper.FieldToMap(lt, fields)
			if err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := enc.Encode(fieldMap); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
		}
	} else {
		fieldMaps := []map[string]interface{}{}

		for _, lt := range lts {
			fieldMap, err := helper.FieldToMap(lt, fields)
			if err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			fieldMaps = append(fieldMaps, fieldMap)
		}

		if _, ok := c.GetQuery("pretty"); ok {
			c.IndentedJSON(200, fieldMaps)
		} else {
			c.JSON(200, fieldMaps)
		}
	}
}

func GetLt(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	parameter, err := dbpkg.NewParameter(c, models.Lt{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	lt := models.Lt{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Lt{}, fields)

	if err := db.Select(queryFields).First(&lt, id).Error; err != nil {
		content := gin.H{"error": "lt with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	fieldMap, err := helper.FieldToMap(lt, fields)
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

func CreateLt(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	lt := models.Lt{}

	if err := c.Bind(&lt); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if err := db.Create(&lt).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, lt)
}

func UpdateLt(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

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

	if err := db.Save(&lt).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.JSON(200, lt)
}

func DeleteLt(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	lt := models.Lt{}

	if db.First(&lt, id).Error != nil {
		content := gin.H{"error": "lt with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := db.Delete(&lt).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
