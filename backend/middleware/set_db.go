package middleware

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/models"
	"net/http"
)

var jwtKey = []byte("my_awsome_key")

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

func CheckJwt() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")

		type Claims struct {
			Email string `json:"email"`
			jwt.StandardClaims
		}

		claims := &Claims{}

		tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				c.JSON(401, gin.H{"error": "Signature Invalid"})
				c.Abort()
				return
			}
			c.JSON(401, gin.H{"error": "auth error"})
			c.Abort()
			return
		}
		if !tkn.Valid {
			c.JSON(401, gin.H{"error": "token is not Valid"})
			c.Abort()
			return
		}

		db := dbpkg.DBInstance(c)
		var user models.User
		db.Where("email = ?", claims.Email).First(&user)
		c.Set("USER", user)
		c.Next()
	}
}

func UserInstance(c *gin.Context) models.User {
	return c.MustGet("USER").(models.User)
}

func Options(c *gin.Context) {
	if c.Request.Method != "OPTIONS" {
		c.Next()
	} else {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "authorization, origin, content-type, accept")
		c.Header("Allow", "HEAD,GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Content-Type", "application/json")
		c.AbortWithStatus(http.StatusOK)
	}
}
