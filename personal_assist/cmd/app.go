package cmd

import (
	"fmt"
	"time"

	"github.com/desertbit/grumble"
	"github.com/fatih/color"
)

var App = grumble.New(&grumble.Config{
	Name:                  "m2020",
	Description:           "Personal Asist 2020",
	HistoryFile:           "m2020.hist",
	Prompt:                time.Now().Format("2006-01-02") + " » ",
	PromptColor:           color.New(color.FgGreen, color.Bold),
	HelpHeadlineColor:     color.New(color.FgGreen),
	HelpHeadlineUnderline: true,
	HelpSubCommands:       true,

	Flags: func(f *grumble.Flags) {
		f.String("d", "directory", "DEFAULT", "set an alternative root directory path")
		f.Bool("v", "verbose", false, "enable verbose mode")
	},
})

func init() {
	App.SetPrintASCIILogo(func(a *grumble.App) {

		fmt.Println("				     ")
		fmt.Println("		 ╔╗ ╔╗ ╔╗ ╔╗  ")
		fmt.Println("		 ╔╝ ║║ ╔╝ ║║  ")
		fmt.Println("		 ╚═ ╚╝ ╚═ ╚╝  ")
		fmt.Println("				     ")
	})
}
