package models

import (
	"github.com/jinzhu/gorm"
	"time"
)

type EntityWithUser interface {
	GetUserId(db *gorm.DB) int
}

type User struct {
	ID                 int    `gorm:"primary_key"`
	Email              string `json:"email"`
	Password           string `json:"password"`
	Firstname          string `json:"firstname"`
	Lastname           string `json:"lastname"`
	WishGroupId        int    `json:"wish_group_id"`
	TransactionGroupId int    `json:"transaction_group_id"`
	ProjectGroupId     int    `json:"project_group_id"`
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

type Wish struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	IsDone    bool      `json:"isDone"`
	Name      string    `json:"name"`
	Picture   string    `json:"picture"`
	PriceFrom int       `json:"priceFrom"`
	PriceTo   int       `json:"priceTo"`
	UserId    int       `json:"-"`
	GroupId   int       `json:"group_id"`
}

func (l Wish) GetUserId(db *gorm.DB) int {
	return l.UserId
}

func (Wish) TableName() string {
	return "wish"
}

type Transaction struct {
	ID          int       `json:"id"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	Category    int       `json:"category"`
	Amount      int       `json:"amount"`
	UserId      int       `json:"-"`
	GroupId     int       `json:"group_id"`
}

func (t Transaction) GetUserId(db *gorm.DB) int {
	return t.UserId
}

func (Transaction) TableName() string {
	return "transaction"
}

type TransactionCategory struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (TransactionCategory) TableName() string {
	return "transaction_category"
}
