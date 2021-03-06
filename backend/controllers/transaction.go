package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	dbpkg "backend/db"
	"backend/middleware"
	"backend/models"
	"log"
	"net/http"
	"time"
)

func GetTransactions(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	var transactions []models.Transaction
	rawQuery := fmt.Sprintf("SELECT * FROM transaction where group_id = %d", middleware.UserInstance(c).TransactionGroupId)
	y, isY := c.GetQuery("y")
	m, isM := c.GetQuery("m")

	if isY && isM {
		rawQuery = fmt.Sprintf("%s and year(`date`) = %s and month(`date`) = %s ;", rawQuery, y, m)
	}

	fmt.Println(rawQuery)
	db.Raw(rawQuery).Scan(&transactions)
	c.JSON(200, transactions)
}

func TransactionStatistics(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	type stat struct {
		Date     string
		Category string
		Sum      int64
	}
	var transactionStat []stat
	rawQuery := `SELECT DATE_FORMAT(date, "%Y-%m") as date, category, SUM(amount) as sum FROM transaction where group_id = ? GROUP BY DATE_FORMAT(date, "%Y-%m"), category;`
	fmt.Println(rawQuery)
	db.Raw(rawQuery, middleware.UserInstance(c).TransactionGroupId).Scan(&transactionStat)
	c.JSON(200, transactionStat)
}

func CreateTransaction(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	transaction := models.Transaction{}

	if err := c.Bind(&transaction); err != nil {
		log.Fatal(err.Error())
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	transaction.UserId = middleware.UserInstance(c).ID
	transaction.GroupId = middleware.UserInstance(c).TransactionGroupId
	transaction.Date = time.Now()
	if err := db.Create(&transaction).Error; err != nil {
		log.Fatal(err.Error())
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

	user := middleware.UserInstance(c)
	if transaction.GroupId != user.TransactionGroupId {
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
	user := middleware.UserInstance(c)
	if transaction.GroupId != user.TransactionGroupId {
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
