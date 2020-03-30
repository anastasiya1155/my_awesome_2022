package controllers

import (
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	dbpkg "github.com/vova/m2019/backend/db"
	"github.com/vova/m2019/backend/helper"
	"github.com/vova/m2019/backend/models"

	_ "github.com/go-sql-driver/mysql"
)

type FormPostLabel struct {
	Post  string `form:"post_id"`
	Label string `form:"label_id"`
}

func GetPosts(c *gin.Context) {

	type Post struct {
		ID         int
		PeriodId   int
		PeriodName string
	}

	db := dbpkg.DBInstance(c)

	var modelPosts []models.Post

	if err := db.
		Select("*").
		Preload("Comments").
		Preload("Labels").
		Order("date DESC").
		Limit(25).
		Find(&modelPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	tochedPosts := make(map[int]models.Post)

	for _, p := range modelPosts {
		tochedPosts[p.ID] = p
	}

	var periodPosts []Post

	if err := db.
		Select("posts.id as id, periods.id as period_id,periods.name as period_name").
		Joins("LEFT JOIN periods ON posts.date BETWEEN periods.start AND IFNULL(periods.end, NOW())").
		Order("date DESC").
		Limit(25).
		Find(&periodPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	for _, post := range periodPosts {
		period := models.Period{}
		period.ID = post.PeriodId
		period.Name = post.PeriodName

		if postExist, ok := tochedPosts[post.ID]; ok {
			postExist.Periods = append(postExist.Periods, period)
			tochedPosts[post.ID] = postExist
		}
	}

	s := make([]models.Post, 0)

	for _, mapElement := range tochedPosts {
		s = append(s, mapElement)
	}
	sort.Slice(s, func(i, j int) bool {
		return s[i].Date.Unix() > s[j].Date.Unix()
	})
	c.IndentedJSON(200, s)
}

func GetPost(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	parameter, err := dbpkg.NewParameter(c, models.Post{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	post := models.Post{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Post{}, fields)

	if err := db.Select(queryFields).First(&post, id).Error; err != nil {
		content := gin.H{"error": "post with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	fieldMap, err := helper.FieldToMap(post, fields)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if _, ok := c.GetQuery("pretty"); ok {
		c.IndentedJSON(200, fieldMap)
	} else {
		c.JSON(200, fieldMap)
	}
}

func CreatePost(c *gin.Context) {

	db := dbpkg.DBInstance(c)
	post := models.Post{}

	if err := c.Bind(&post); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&post).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, post)
}

func UpdatePost(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	post := models.Post{}

	if db.First(&post, id).Error != nil {
		content := gin.H{"error": "post with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&post); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&post).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, post)
}

func DeletePost(c *gin.Context) {
	db := dbpkg.DBInstance(c)
	id := c.Params.ByName("id")
	post := models.Post{}

	if db.First(&post, id).Error != nil {
		content := gin.H{"error": "post with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := db.Delete(&post).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}

func GetThisDayInHistory(c *gin.Context) {
	GetPostsByFilter(c, "DATE_FORMAT(date, '%m-%d') = ?", time.Now().Format("01-02"))
}

func AddPostLabel(c *gin.Context) {
	db := dbpkg.DBInstance(c)

	var form FormPostLabel

	if c.ShouldBindQuery(&form) == nil {
		query := "INSERT INTO `posts_labels` (`post_id`,`label_id`)  values( ?, ?)"
		db.Exec(query, form.Post, form.Label)
		c.JSON(200, "success")

	}

	c.JSON(200, "not 200")

}

func DeletePostLabel(c *gin.Context) {
	db := dbpkg.DBInstance(c)

	var form FormPostLabel

	if c.ShouldBindQuery(&form) == nil {
		post := models.Post{}
		label := models.Label{}

		if db.Preload("Labels").First(&post, form.Post).Error != nil {
			content := gin.H{"error": "post with id#" + form.Post + " not found"}
			c.JSON(404, content)
			return
		}

		if db.First(&label, form.Label).Error != nil {
			content := gin.H{"error": "label with id#" + form.Label + " not found"}
			c.JSON(404, content)
			return
		}

		db.Debug().Model(&post).Association("Labels").Delete(&models.Label{ID: label.ID})

		c.JSON(200, post)

	}

	c.JSON(200, "not 200")
}

// це шоб отримати менюху з місяцями
func GetPostMonths(c *gin.Context) {

	db := dbpkg.DBInstance(c)

	type Result struct {
		YM  string
		M   string
		Y   string
		Cnt int
	}

	var result []Result

	sqlquery := `SELECT 
		DATE_FORMAT(date, '%y-%m') ym,
		DATE_FORMAT(date, '%M') m,
		DATE_FORMAT(date, '%Y') y,
		COUNT(id) cnt
	FROM
		posts
	GROUP BY 
		DATE_FORMAT(date, '%y-%m'),
		DATE_FORMAT(date, '%M'),
		DATE_FORMAT(date, '%Y')	
	;`

	db.Raw(sqlquery).Scan(&result)

	byYears := make(map[string][]Result)
	for _, month := range result {
		y := month.Y
		byYears[y] = append(byYears[y], month)
	}

	c.JSON(200, byYears)
}

func GetPostByMonth(c *gin.Context) {
	ym := c.DefaultQuery("ym", "10-10")
	GetPostsByFilter(c, "DATE_FORMAT(date, '%y-%m') = ?", ym)
}

func Sandbox(c *gin.Context) {
	GetPostsByFilter(c, "DATE_FORMAT(date, '%m-%d') = ?", time.Now().Format("01-02"))
}

func GetPostsByFilter(c *gin.Context, query interface{}, args ...interface{}) {

	type Post struct {
		ID         int
		PeriodId   int
		PeriodName string
	}

	db := dbpkg.DBInstance(c)

	var modelPosts []models.Post

	if err := db.
		Select("*").
		Where(query, args).
		Preload("Comments").
		Preload("Labels").
		Find(&modelPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	tochedPosts := make(map[int]models.Post)

	for _, p := range modelPosts {
		tochedPosts[p.ID] = p
	}

	var periodPosts []Post

	if err := db.
		Select("posts.id as id, periods.id as period_id,periods.name as period_name").
		Joins("LEFT JOIN periods ON posts.date BETWEEN periods.start AND IFNULL(periods.end, NOW())").
		Where(query, args).
		Find(&periodPosts).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	for _, post := range periodPosts {
		period := models.Period{}
		period.ID = post.PeriodId
		period.Name = post.PeriodName

		if postExist, ok := tochedPosts[post.ID]; ok {
			postExist.Periods = append(postExist.Periods, period)
			tochedPosts[post.ID] = postExist
		}
	}

	s := make([]models.Post, 0)

	for _, mapElement := range tochedPosts {
		fmt.Printf("%d - %s ", mapElement.ID, mapElement.Date)
		s = append(s, mapElement)
	}
	sort.Slice(s, func(i, j int) bool {
		return s[i].Date.Unix() < s[j].Date.Unix()
	})
	c.IndentedJSON(200, s)
}
