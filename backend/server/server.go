package server

import (
	"github.com/gin-contrib/cors"
	"github.com/vova/pa2020/backend/middleware"
	"github.com/vova/pa2020/backend/router"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func Setup(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.Options)
	r.Use(middleware.SetDBtoContext(db))
	r.Use(cors.Default())
	router.Initialize(r)
	return r
}
