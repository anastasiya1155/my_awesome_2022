package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/middleware"
	"github.com/vova/pa2020/backend/models"
)

func ListNote(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var listNote []models.Note
	cat := c.Query("note_category")
	query := "SELECT * FROM note where user_id = ? and note_category = ?"
	db.Raw(query, middleware.UserInstance(c).ID, cat).Scan(&listNote)
	c.JSON(200, listNote)
}

func CreateNote(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var note models.Note
	note.UserId = middleware.UserInstance(c).ID
	if err := c.Bind(&note); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&note).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, note)
}

func ReadNote(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	var note models.Note

	if db.First(&note, id).Error != nil {
		content := gin.H{"error": "note with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, note) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	c.JSON(200, note)
}

func UpdateNote(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	var note models.Note
	if db.First(&note, id).Error != nil {
		content := gin.H{"error": "note with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&note); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, note) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&note).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, note)

}

func DeleteNote(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	var note models.Note
	if db.First(&note, id).Error != nil {
		content := gin.H{"error": "note with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}
	if !vote(c, note) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&note).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.JSON(204, "deleted")
}

func ListNoteCategory(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var listNoteCategory []models.NoteCategory
	query := "SELECT * FROM note_category where user_id = ?"
	db.Raw(query, middleware.UserInstance(c).ID).Scan(&listNoteCategory)
	c.JSON(200, listNoteCategory)
}

func CreateNoteCategory(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var note_category models.NoteCategory
	note_category.UserId = middleware.UserInstance(c).ID

	if err := c.Bind(&note_category); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&note_category).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, note_category)
}

func ReadNoteCategory(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	var note_category models.NoteCategory
	if db.First(&note_category, id).Error != nil {
		content := gin.H{"error": "note_category with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}
	if !vote(c, note_category) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}
	c.JSON(200, note_category)
}

func UpdateNoteCategory(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	var note_category models.NoteCategory
	if db.First(&note_category, id).Error != nil {
		content := gin.H{"error": "note_category with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&note_category); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, note_category) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&note_category).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, note_category)

}

func DeleteNoteCategory(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	var note_category models.NoteCategory
	if db.First(&note_category, id).Error != nil {
		content := gin.H{"error": "note_category with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}
	if !vote(c, note_category) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}
	if err := db.Delete(&note_category).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.JSON(204, "deleted")
}
