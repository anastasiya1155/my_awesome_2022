package cmd

import (
	"fmt"

	"github.com/desertbit/grumble"
	"gopkg.in/AlecAivazis/survey.v1"
)

func init() {
	App.AddCommand(&grumble.Command{
		Name: "ask",
		Help: "ask the user for foo",
		Run: func(c *grumble.Context) error {
			ask()
			return nil
		},
	})
}

// the questions to ask
var qs = []*survey.Question{
	{
		Name:   "City",
		Prompt: &survey.Input{Message: "City?", Default: "Київ"},
	},
	{
		Name:   "Weather",
		Prompt: &survey.Input{Message: "Weather?"},
	},
	{
		Name:   "Thoughts",
		Prompt: &survey.Input{Message: "Any Thoughts?"},
	},

	{
		Name:   "Work",
		Prompt: &survey.Input{Message: "Work(what interesting done)"},
	},

	{
		Name:   "Flowers",
		Prompt: &survey.Confirm{Message: "Flowers?"},
	},
	{
		Name:   "Shave",
		Prompt: &survey.Confirm{Message: "Shave?"},
	},
	{
		Name:   "Fitness",
		Prompt: &survey.Confirm{Message: "Fitness/Cross?"},
	},
	{
		Name:   "Beer",
		Prompt: &survey.Confirm{Message: "Beer?"},
	},
	{
		Name:   "English",
		Prompt: &survey.Confirm{Message: "English?"},
	},
	{
		Name:   "Golang",
		Prompt: &survey.Confirm{Message: "GOlANG?"},
	},

	//{
	//	Name:   "day",
	//	Prompt: &survey.MultiSelect{
	//	Message: "What days do you prefer:",
	//	Options: []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}},
	//},

}

func ask() {
	// the answers will be written to this struct
	answers := struct {
		City     string
		Weather  string
		Thoughts string
		Work     string

		Flowers bool
		Shave   bool
		Fitness bool
		Beer    bool
		English bool
		Golang  bool
	}{}

	// perform the questions
	err := survey.Ask(qs, &answers)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	fmt.Println(answers.City, answers.Weather, answers.Thoughts, answers.Work)
}
