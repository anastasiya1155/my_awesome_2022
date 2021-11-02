package middleware

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/patrickmn/go-cache"
	dbpkg "github.com/vova/pa2020/backend/db"
	"github.com/vova/pa2020/backend/models"
	"io/ioutil"
	"log"
	"net/http"
)

var jwtKey = []byte("my_awsome_key")

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

type AuthResp struct {
	Error bool `json:"error"`
	Code int `json:"code"`
	ErrorMessage string `json:"message"`
	Email string `json:"email"`
}

func CheckJwt() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")
		cacheInstance := CacheInstance(c)
		cachedEmail, found := cacheInstance.Get(token)

		// todo: string
		var email interface{}
		if found {
			email = cachedEmail
		} else {
			resp, err := http.Get("http://auth:18401/auth?token="+token)
			if err != nil {
				log.Fatalln(err)
			}
			//We Read the response body on the line below.
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Fatalln(err)
			}
			var authResponse AuthResp
			if err := json.Unmarshal(body, &authResponse); err != nil {
				log.Fatal(err)
			}
			if authResponse.Error {
				c.JSON(401, gin.H{"error": "token is not Valid"})
				c.Abort()
				return
			}
			email = authResponse.Email
			cacheInstance.Set(token, email, cache.DefaultExpiration)
		}

		db := dbpkg.DBInstance(c)
		var user models.User
		db.Where("email = ?", email).First(&user)

		if user.ID > 0 {
			c.Set("USER", user)
			c.Next()
		} else {
			c.JSON(401, gin.H{"error": "token is not Valid"})
			c.Abort()
			return
		}
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

func Cache(cache *cache.Cache) gin.HandlerFunc   {
	return func(c *gin.Context) {
		c.Set("CACHE", cache)
		c.Next()
	}
}

func CacheInstance(c *gin.Context) *cache.Cache {
	return c.MustGet("CACHE").(*cache.Cache)
}
