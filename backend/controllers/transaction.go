package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/middleware"
	"github.com/vova/pa2020/backend/models"
	"net/http"
)

func GetTransactions(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var transactions []models.Transaction
	rawQuery := "SELECT * FROM transaction where user_id = ?;"
	db.Raw(rawQuery, middleware.UserInstance(c).ID).Scan(&transactions)
	c.JSON(201, transactions)
}

func CreateTransaction(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	transaction := models.Transaction{}

	if err := c.Bind(&transaction); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	transaction.UserId = middleware.UserInstance(c).ID

	if err := db.Create(&transaction).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, transaction)
}

func UpdateTransaction(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	transaction := models.Transaction{}

	if db.First(&transaction, id).Error != nil {
		content := gin.H{"error": "transaction with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&transaction); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !vote(c, transaction) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Save(&transaction).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, transaction)
}

func DeleteTransaction(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	transaction := models.Transaction{}

	if db.First(&transaction, id).Error != nil {
		content := gin.H{"error": "transaction with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if !vote(c, transaction) {
		c.JSON(403, "you dont have permissions")
		c.Abort()
		return
	}

	if err := db.Delete(&transaction).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
