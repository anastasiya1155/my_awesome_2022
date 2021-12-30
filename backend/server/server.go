package server

import (
	"github.com/gin-contrib/cors"
	"github.com/patrickmn/go-cache"
	"backend/middleware"
	"backend/router"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func Setup(db *gorm.DB, c *cache.Cache) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.Cache(c))
	r.Use(middleware.Options)
	r.Use(middleware.SetDBtoContext(db))
	r.Use(cors.Default())
	router.Initialize(r)
	return r
}
