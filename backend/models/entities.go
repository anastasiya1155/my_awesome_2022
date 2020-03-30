package models

import "time"

type Post struct {
	ID   int       `gorm:"primary_key"`
	Date time.Time `sql:"type:date;"time_format:"2006-01-02"`
	Body string    `sql:"type:text"`

	Labels   []Label `gorm:"many2many:posts_labels";"ForeignKey:PostId"`
	Comments []Comment
	Periods  []Period
}

type Label struct {
	ID          int `gorm:"primary_key"`
	Name        string
	Color       string
	ColorActive string
}

type Project struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type Task struct {
	ID        int       `json:"id"`
	Body      string    `json:"body"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	ProjectId int       `json:"project_id"`
}

type Pin struct {
	ID       int    `gorm:"primary_key"`
	Name     string `sql:"type:text;"`
	Priority int
}

type Comment struct {
	ID     int       `gorm:"primary_key"`
	Date   time.Time `sql:"type:date;"`
	Body   string    `sql:"type:text;"`
	PostId int
}

type Photo struct {
	ID   int       `gorm:"primary_key"`
	Date time.Time `sql:"type:date;"time_format:"2006-01-02"`
	Path string
}

type Period struct {
	ID    int `gorm:"primary_key"`
	Name  string
	Start time.Time
	End   time.Time
}

type Wish struct {
	ID          int
	Name        string
	Description string
	Price       int
	Picture     string
}
