package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

func SetCorsHeader() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Next()
	}
}
