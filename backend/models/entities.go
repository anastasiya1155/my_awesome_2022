package models

import (
	"github.com/jinzhu/gorm"
	"time"
)

type EntityWithUser interface {
	GetUserId(db *gorm.DB) int
}

type User struct {
	ID        int    `gorm:"primary_key"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}

func (User) TableName() string {
	return "user"
}

func (u User) GetUserId(db *gorm.DB) int {
	return u.ID
}

type Post struct {
	ID       int       `gorm:"primary_key"`
	Date     time.Time `sql:"type:date;"time_format:"2006-01-02"`
	Body     string    `sql:"type:text"`
	UserId   int       `json:"-"`
	Labels   []Label   `gorm:"many2many:posts_labels";"ForeignKey:PostId"`
	Comments []Comment
	Periods  []Period
}

func (p Post) GetUserId(db *gorm.DB) int {
	return p.UserId
}

type Label struct {
	ID          int `gorm:"primary_key"`
	Name        string
	Color       string
	ColorActive string
	UserId      int `json:"-"`
}

func (l Label) GetUserId(db *gorm.DB) int {
	return l.UserId
}

type Project struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Priority    int       `json:"priority"`
	Archived    bool      `json:"archived"`
	CreatedAt   time.Time `json:"created_at"`
	UserId      int       `json:"-"`
}

func (p Project) GetUserId(db *gorm.DB) int {
	return p.UserId
}

type Task struct {
	ID            int       `json:"id"`
	Body          string    `json:"body"`
	Status        string    `json:"status"`
	Priority      int       `json:"priority"`
	CreatedAt     time.Time `json:"created_at"`
	ProjectId     int       `json:"project_id"`
	Archived      bool      `json:"archived"`
	TodayILearned bool      `json:"today_i_learned"`
	Outcome       string    `json:"outcome"`
}

func (t Task) GetUserId(db *gorm.DB) int {
	var p Project
	db.Where("id = ?", t.ProjectId).First(&p)
	return p.UserId
}

type Comment struct {
	ID     int       `gorm:"primary_key"`
	Date   time.Time `sql:"type:date;"`
	Body   string    `sql:"type:text;"`
	PostId int
}

func (c Comment) GetUserId(db *gorm.DB) int {
	var p Post
	db.Where("id = ?", c.PostId).First(&p)
	return p.UserId
}

type Period struct {
	ID     int `gorm:"primary_key"`
	Name   string
	Start  time.Time
	End    time.Time
	UserId int `json:"-"`
}

func (p Period) GetUserId(db *gorm.DB) int {
	return p.UserId
}

type Lt struct {
	ID              int       `json:"id"`
	Date            time.Time `json:"date"`
	Body            string    `json:"body"`
	UserId          int       `json:"-"`
	RemindAfterDays int       `json:"remind_after_days"`
}

func (l Lt) GetUserId(db *gorm.DB) int {
	return l.UserId
}

func (Lt) TableName() string {
	return "last_time"
}
