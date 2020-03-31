package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/vova/pa2020/backend/controllers"
)

func Initialize(r *gin.Engine) {
	r.GET("/", controllers.APIEndpoints)

	api := r.Group("")
	{

		api.GET("/comments", controllers.GetComments)
		api.GET("/comments/:id", controllers.GetComment)
		api.POST("/comments", controllers.CreateComment)
		api.PUT("/comments/:id", controllers.UpdateComment)
		api.DELETE("/comments/:id", controllers.DeleteComment)

		api.GET("/labels", controllers.GetLabels)
		api.GET("/labels/:id", controllers.GetLabel)
		api.POST("/labels", controllers.CreateLabel)
		api.PUT("/labels/:id", controllers.UpdateLabel)
		api.DELETE("/labels/:id", controllers.DeleteLabel)

		api.GET("/pins", controllers.GetPins)
		api.GET("/pins/:id", controllers.GetPin)
		api.POST("/pins", controllers.CreatePin)
		api.PUT("/pins/:id", controllers.UpdatePin)
		api.DELETE("/pins/:id", controllers.DeletePin)

		api.GET("/posts", controllers.GetPosts)
		api.GET("/posts/:id", controllers.GetPost)
		api.POST("/posts", controllers.CreatePost)
		api.PUT("/posts/:id", controllers.UpdatePost)
		api.DELETE("/posts/:id", controllers.DeletePost)

		api.GET("/posts-history", controllers.GetThisDayInHistory)
		api.GET("/posts-add-label/", controllers.AddPostLabel)
		api.GET("/posts-delete-label/", controllers.DeletePostLabel)
		api.GET("/posts-months/", controllers.GetPostMonths)
		api.GET("/posts-by-month/", controllers.GetPostByMonth)

		api.GET("/tasks", controllers.GetTasks)
		api.GET("/tasks/:id", controllers.GetTask)
		api.POST("/tasks", controllers.CreateTask)
		api.PUT("/tasks/:id", controllers.UpdateTask)
		api.DELETE("/tasks/:id", controllers.DeleteTask)

		api.GET("/projects", controllers.GetProjects)
		api.GET("/projects/:id", controllers.GetProject)
		api.POST("/projects", controllers.CreateProject)
		api.PUT("/projects/:id", controllers.UpdateProject)
		api.DELETE("/projects/:id", controllers.DeleteProject)

		api.GET("/wishes", controllers.GetWishes)
		api.GET("/wishes/:id", controllers.GetWish)
		api.POST("/wishes", controllers.CreateWish)
		api.PUT("/wishes/:id", controllers.UpdateWish)
		api.DELETE("/wishes/:id", controllers.DeleteWish)

	}

	r.Use(cors.Default())
}
