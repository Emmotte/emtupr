package main

import (
	"errors"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/charmbracelet/bubbles/list"
	"github.com/charmbracelet/bubbles/viewport"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type section int

const (
	sectionMenu section = iota
	sectionHome
	sectionDigital
	sectionPhysical
	sectionDetail
	sectionAbout
	sectionContact
)

type Project struct {
	ID          string
	Title       string
	Category    string
	Role        string
	Period      string
	Description string
	Content     string
	Tags        []string
	Link        string
}

type menuItem struct {
	title   string
	desc    string
	section section
}

func (m menuItem) Title() string       { return m.title }
func (m menuItem) Description() string { return m.desc }
func (m menuItem) FilterValue() string { return m.title }

type projectItem struct {
	project Project
}

func (p projectItem) Title() string       { return p.project.Title }
func (p projectItem) Description() string { return fmt.Sprintf("%s · %s", p.project.Category, p.project.Period) }
func (p projectItem) FilterValue() string { return p.project.Title }

type model struct {
	width        int
	height       int
	section      section
	menu         list.Model
	projectList  list.Model
	viewport     viewport.Model
	contentTitle string
	current      *Project
	projectLabel string
}

var (
	titleStyle  = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("212"))
	helpStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("241"))
	headerStyle = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("81"))
)

func initialModel(start section) model {
	menuItems := []list.Item{
		menuItem{title: "Home", desc: "Overview and quick links", section: sectionHome},
		menuItem{title: "Digital Projects", desc: "Video, audio, and photography work", section: sectionDigital},
		menuItem{title: "Physical & Design", desc: "Infrastructure and product design", section: sectionPhysical},
		menuItem{title: "About", desc: "Background & philosophy", section: sectionAbout},
		menuItem{title: "Contact", desc: "Get in touch", section: sectionContact},
	}

	menu := list.New(menuItems, list.NewDefaultDelegate(), 0, 0)
	menu.Title = "emtupr"
	menu.SetShowStatusBar(false)
	menu.SetFilteringEnabled(false)
	menu.SetShowHelp(false)

	projectList := list.New([]list.Item{}, list.NewDefaultDelegate(), 0, 0)
	projectList.Title = "Projects"
	projectList.SetShowStatusBar(false)
	projectList.SetFilteringEnabled(true)
	projectList.SetShowHelp(false)

	m := model{
		section:     sectionMenu,
		menu:        menu,
		projectList: projectList,
		viewport:    viewport.New(0, 0),
	}

	m.navigateTo(start)
	return m
}

func (m *model) navigateTo(target section) {
	m.section = target
	switch target {
	case sectionHome:
		m.setContent("Home", homeContent())
	case sectionAbout:
		m.setContent("About", aboutContent())
	case sectionContact:
		m.setContent("Contact", contactContent())
	case sectionDigital:
		m.setProjectList("Digital Projects", digitalProjects)
	case sectionPhysical:
		m.setProjectList("Physical & Design", physicalProjects)
	}
}

func (m *model) setContent(title, body string) {
	m.contentTitle = title
	m.viewport.SetContent(body)
}

func (m *model) setProjectList(label string, projects []Project) {
	items := make([]list.Item, 0, len(projects))
	for _, project := range projects {
		items = append(items, projectItem{project: project})
	}
	m.projectLabel = label
	m.projectList.SetItems(items)
	m.projectList.Title = label
	m.projectList.ResetFilter()
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		m.menu.SetSize(max(20, msg.Width-4), max(8, msg.Height-8))
		m.projectList.SetSize(max(20, msg.Width-4), max(8, msg.Height-8))
		m.viewport.Width = max(20, msg.Width-4)
		m.viewport.Height = max(8, msg.Height-8)
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			return m, tea.Quit
		case "esc":
			switch m.section {
			case sectionDetail:
				if m.current != nil {
					m.section = sectionDigital
					if m.current.Category == "Engineering" || m.current.Category == "Design" {
						m.section = sectionPhysical
					}
				} else {
					m.section = sectionMenu
				}
				m.current = nil
			case sectionHome, sectionAbout, sectionContact, sectionDigital, sectionPhysical:
				m.section = sectionMenu
			}
		case "enter":
			if m.section == sectionMenu {
				if item, ok := m.menu.SelectedItem().(menuItem); ok {
					m.navigateTo(item.section)
				}
				return m, nil
			}
			if m.section == sectionDigital || m.section == sectionPhysical {
				if item, ok := m.projectList.SelectedItem().(projectItem); ok {
					project := item.project
					m.current = &project
					m.section = sectionDetail
					m.setContent(project.Title, projectDetailContent(project))
				}
				return m, nil
			}
		}
	}

	var cmd tea.Cmd
	switch m.section {
	case sectionMenu:
		m.menu, cmd = m.menu.Update(msg)
	case sectionDigital, sectionPhysical:
		m.projectList, cmd = m.projectList.Update(msg)
	case sectionDetail, sectionHome, sectionAbout, sectionContact:
		m.viewport, cmd = m.viewport.Update(msg)
	}
	return m, cmd
}

func (m model) View() string {
	switch m.section {
	case sectionMenu:
		return layoutView(titleStyle.Render("emtupr TUI"), m.menu.View(), helpStyle.Render("enter: open • q: quit"))
	case sectionDigital, sectionPhysical:
		listView := m.projectList.View()
		if len(m.projectList.Items()) == 0 {
			listView = helpStyle.Render("No projects available yet.")
		}
		return layoutView(headerStyle.Render(m.projectLabel), listView, helpStyle.Render("enter: details • /: filter • esc: back • q: quit"))
	case sectionDetail:
		return layoutView(headerStyle.Render(m.contentTitle), m.viewport.View(), helpStyle.Render("esc: back • q: quit"))
	case sectionHome, sectionAbout, sectionContact:
		return layoutView(headerStyle.Render(m.contentTitle), m.viewport.View(), helpStyle.Render("esc: back • q: quit"))
	default:
		return ""
	}
}

func layoutView(title, body, footer string) string {
	return lipgloss.JoinVertical(lipgloss.Left, title, "", body, "", footer)
}

func homeContent() string {
	return strings.TrimSpace(`
emtupr works.

Network Engineer · Product Designer · Audiovisual Artist

Navigate the menu to explore digital projects, physical design work, and project details. Use "/" to filter lists and enter to open a project.
`)
}

func aboutContent() string {
	return strings.TrimSpace(`
Hello, I'm Emmett. I build digital experiences where robust network engineering meets minimalist product design and high-fidelity media production.

The digital space shouldn't be noisy. I aim to create architectures—both literal networks and conceptual digital products—that empower users without demanding attention.

"The best infrastructure is invisible."
`)
}

func contactContent() string {
	return strings.TrimSpace(`
Email: emmetttupper1@gmail.com
Site:  emtupr.dev

For collaborations, send a quick note with your project scope, timeline, and the kind of support you need.
`)
}

func projectDetailContent(project Project) string {
	builder := &strings.Builder{}
	fmt.Fprintf(builder, "%s\n\n", project.Description)
	if project.Role != "" || project.Period != "" {
		fmt.Fprintf(builder, "Role:   %s\n", project.Role)
		fmt.Fprintf(builder, "Period: %s\n\n", project.Period)
	}
	if len(project.Tags) > 0 {
		fmt.Fprintf(builder, "Tags: %s\n\n", strings.Join(project.Tags, ", "))
	}
	if project.Link != "" {
		fmt.Fprintf(builder, "Link: %s\n\n", project.Link)
	}
	if project.Content != "" {
		fmt.Fprint(builder, simplifyMarkdown(project.Content))
	}
	return builder.String()
}

func simplifyMarkdown(input string) string {
	replacer := strings.NewReplacer(
		"### ", "",
		"## ", "",
		"# ", "",
	)
	return strings.TrimSpace(replacer.Replace(input))
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func gumChoose(options []string) (string, error) {
	if len(options) == 0 {
		return "", errors.New("no options supplied")
	}
	_, err := exec.LookPath("gum")
	if err != nil {
		return "", fmt.Errorf("gum not found in PATH")
	}
	cmd := exec.Command("gum", append([]string{"choose"}, options...)...)
	cmd.Stdin = os.Stdin
	out, err := cmd.Output()
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(out)), nil
}

func main() {
	noGum := flag.Bool("no-gum", false, "skip gum prompt")
	flag.Parse()

	start := sectionMenu
	if !*noGum {
		choice, err := gumChoose([]string{"Home", "Digital", "Physical", "About", "Contact"})
		if err != nil {
			fmt.Fprintln(os.Stderr, "gum unavailable, starting in menu")
		} else {
			switch choice {
			case "Home":
				start = sectionHome
			case "Digital":
				start = sectionDigital
			case "Physical":
				start = sectionPhysical
			case "About":
				start = sectionAbout
			case "Contact":
				start = sectionContact
			}
		}
	}

	program := tea.NewProgram(initialModel(start), tea.WithAltScreen())
	if err := program.Start(); err != nil {
		fmt.Fprintln(os.Stderr, "failed to start TUI:", err)
		os.Exit(1)
	}
}

var digitalProjects = []Project{
	{
		ID:          "wet-knee",
		Category:    "Photography",
		Title:       "Wet Knee Photoshoot",
		Role:        "Photographer",
		Period:      "2026",
		Description: "Band promotional shoot capturing raw energy and the local atmosphere.",
		Content: "### Overview\nA candid photoshoot for my band, Wet Knee. We focused on raw urban textures to complement our sound.\n\n" +
			"### Gallery\n- IMG_7755.jpg\n- IMG_7741.jpg\n- IMG_7777.jpg\n- IMG_7782.jpg\n- IMG_7850.jpg\n- IMG_7881.jpg\n- IMG_7889.jpg\n- IMG_7910.jpg\n- IMG_7912.jpg\n- IMG_7739.jpg\n- IMG_7844-3.jpg\n- IMG_7886.jpg\n- IMG_7902.jpg\n- IMG_7904.jpg\n- IMG_7908.jpg\n- IMG_7918.jpg\n- IMG_7922-2.jpg\n- IMG_7923.jpg\n- IMG_7835.jpg\n- IMG_7839-2.jpg\n- IMG_7840.jpg\n- IMG_7880.jpg\n- IMG_7780.jpg\n- IMG_7761.jpg\n- IMG_7751.jpg\n- IMG_7751-2.jpg\n- IMG_7761-2.jpg\n- IMG_7886-2.jpg\n- IMG_7894.jpg\n- IMG_7887.jpg",
		Tags: []string{"Canon T2i", "Lightroom", "Band Photography"},
	},
	{
		ID:          "digital-junk",
		Category:    "Video",
		Title:       "Digital Junk Collective",
		Role:        "Director / Editor",
		Period:      "2023",
		Description: "Directed and edited a stylized short film exploring the aesthetic of digital degradation and artifacts.",
		Content: "### Direction\nExploring the beauty in broken things. We deliberately degraded 4K footage using analog tape workflows to create a unique texture.\n\n" +
			"### Impact\nScreened at three underground video art festivals in 2023.",
		Tags: []string{"Premiere Pro", "After Effects", "Color Grading"},
	},
	{
		ID:          "urban",
		Category:    "Photography",
		Title:       "Urban Spaces & People",
		Role:        "Photographer",
		Period:      "2016 — Present",
		Description: "Ongoing photographic series documenting the intersection of modern architecture and human interaction.",
		Content: "### Process\nShot entirely on 35mm film across various global cities. The focus is on finding stillness in chaotic environments.\n\n" +
			"### Exhibitions\n- \"Concrete & Glass\", 2019\n- \"The Spaces Between\", 2021",
		Tags: []string{"Portraiture", "Street Photography", "Lightroom"},
	},
	{
		ID:          "live",
		Category:    "Audio",
		Title:       "Live Electronic Performances",
		Role:        "Performer & Sound Designer",
		Period:      "2019 — Present",
		Description: "Improvisational live sets blending hip-hop beats with generative electronic soundscapes.",
		Content: "### Setup\nHardware-centric live setup using Elektron rhythm machines and Moog synthesizers sequenced via Ableton Live.\n\n" +
			"### Philosophy\nNo two performances are ever the same. The generative elements allow for structured improvisation.",
		Tags: []string{"Ableton Live", "Max/MSP", "Sound Design"},
	},
	{
		ID:          "studio",
		Category:    "Audio",
		Title:       "Studio Mixing & Mastering",
		Role:        "Audio Engineer",
		Period:      "2017 — Present",
		Description: "Professional mixing and mastering for independent artists, tuned for clarity and dynamic range.",
		Content: "### Technical Approach\nHybrid analog/digital workflow. Using high-end outboard gear for color and warmth, and precise digital EQs for surgical corrections.\n\n" +
			"### Client Success\nSeveral tracks mixed in this studio have gone on to reach top spots on streaming playlists.",
		Tags: []string{"Pro Tools", "Logic Pro", "Mixing", "Mastering"},
	},
}

var physicalProjects = []Project{}
