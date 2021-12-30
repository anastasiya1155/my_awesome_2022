package controllers

import (
	"github.com/gin-gonic/gin"
	dbpkg "backend/db"
	"backend/models"
	"net/http"
)

func GetTransactionCategories(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var transactionCategories []models.TransactionCategory
	rawQuery := "SELECT * FROM transaction_category;"
	db.Raw(rawQuery).Scan(&transactionCategories)
	c.JSON(200, transactionCategories)
}

func CreateTransactionCategory(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	transactionCategory := models.TransactionCategory{}

	if err := c.Bind(&transactionCategory); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&transactionCategory).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, transactionCategory)
}

func UpdateTransactionCategory(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	transactionCategory := models.TransactionCategory{}

	if db.First(&transactionCategory, id).Error != nil {
		content := gin.H{"error": "transactionCategory with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&transactionCategory); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&transactionCategory).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, transactionCategory)
}

func DeleteTransactionCategory(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	transactionCategory := models.TransactionCategory{}

	if db.First(&transactionCategory, id).Error != nil {
		content := gin.H{"error": "transactionCategory with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := db.Delete(&transactionCategory).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
