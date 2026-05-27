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

type card struct {
	title string
	body  string
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

func (p projectItem) Title() string { return p.project.Title }
func (p projectItem) Description() string {
	return fmt.Sprintf("%s · %s", p.project.Category, p.project.Period)
}
func (p projectItem) FilterValue() string { return p.project.Title }

type model struct {
	width        int
	height       int
	section      section
	theme        themeMode
	menu         list.Model
	projectList  list.Model
	viewport     viewport.Model
	contentTitle string
	current      *Project
	projectLabel string
}

type themeMode string

const (
	themeDark  themeMode = "dark"
	themeLight themeMode = "light"
)

type palette struct {
	ink         lipgloss.Color
	muted       lipgloss.Color
	accent      lipgloss.Color
	accentSoft  lipgloss.Color
	border      lipgloss.Color
	panel       lipgloss.Color
	panelSoft   lipgloss.Color
	chipBg      lipgloss.Color
	chipFg      lipgloss.Color
	statusBg    lipgloss.Color
	statusFg    lipgloss.Color
}

var (
	titleStyle    = lipgloss.NewStyle().Bold(true)
	headerStyle   = lipgloss.NewStyle().Bold(true)
	subtleStyle   = lipgloss.NewStyle()
	keyStyle      = lipgloss.NewStyle().Bold(true)
	selectedStyle = lipgloss.NewStyle().Bold(true)
)

func initialModel(start section) model {
	menuItems := []list.Item{
		menuItem{title: "Home", desc: "Overview and quick links", section: sectionHome},
		menuItem{title: "Digital Projects", desc: "Video, audio, and photography work", section: sectionDigital},
		menuItem{title: "Physical & Design", desc: "Infrastructure and product design", section: sectionPhysical},
		menuItem{title: "About", desc: "Background & philosophy", section: sectionAbout},
		menuItem{title: "Contact", desc: "Get in touch", section: sectionContact},
	}

	menu := list.New(menuItems, newMenuDelegate(), 0, 0)
	menu.Title = ""
	menu.SetShowTitle(false)
	menu.SetShowStatusBar(false)
	menu.SetFilteringEnabled(false)
	menu.SetShowHelp(false)

	projectList := list.New([]list.Item{}, newProjectDelegate(), 0, 0)
	projectList.Title = ""
	projectList.SetShowTitle(false)
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
		m.handleResize(msg.Width, msg.Height)
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
	if m.width == 0 || m.height == 0 {
		return ""
	}

	contentWidth, contentHeight, listHeight, leftWidth, rightWidth, cardHeight := layoutBounds(m.width, m.height)
	header := renderHeaderLine()
	tabs := renderTabs(m.section)
	footer := renderStatusBar(m.width, m.section)

	var body string
	switch m.section {
	case sectionMenu:
		body = m.renderMenuView(listHeight, leftWidth, rightWidth, contentWidth, cardHeight)
	case sectionDigital, sectionPhysical:
		body = m.renderProjectView(listHeight, leftWidth, rightWidth, contentWidth, cardHeight)
	case sectionDetail, sectionHome, sectionAbout, sectionContact:
		body = m.renderContentView(contentWidth, contentHeight)
	}

	return lipgloss.JoinVertical(lipgloss.Left, header, tabs, body, footer)
}

func layoutView(title, body, footer string) string {
	return lipgloss.JoinVertical(lipgloss.Left, title, "", body, "", footer)
}

func (m *model) handleResize(width, height int) {
	m.width = width
	m.height = height

	contentWidth, contentHeight, listHeight, leftWidth, _, _ := layoutBounds(width, height)
	listWidth := max(20, leftWidth-6)

	m.menu.SetSize(listWidth, max(6, listHeight-4))
	m.projectList.SetSize(listWidth, max(6, listHeight-4))
	m.viewport.Width = max(20, contentWidth-6)
	m.viewport.Height = max(8, contentHeight-4)
}

func layoutBounds(width, height int) (contentWidth, contentHeight, listHeight, leftWidth, rightWidth, cardHeight int) {
	contentWidth = max(60, width-4)
	contentHeight = max(18, height-6)
	cardHeight = 8
	listHeight = max(10, contentHeight-cardHeight-1)
	leftWidth = max(26, contentWidth/2)
	rightWidth = max(26, contentWidth-leftWidth-2)
	return
}

func renderHeaderLine() string {
	return lipgloss.JoinHorizontal(
		lipgloss.Left,
		titleStyle.Render("~ /emtupr"),
	)
}

func renderTabs(current section) string {
	tabs := []struct {
		label   string
		section section
	}{
		{"Menu", sectionMenu},
		{"Home", sectionHome},
		{"Digital", sectionDigital},
		{"Physical", sectionPhysical},
		{"About", sectionAbout},
		{"Contact", sectionContact},
	}

	rendered := make([]string, 0, len(tabs))
	for _, tab := range tabs {
		if tab.section == current {
			rendered = append(rendered, tabActive.Render(tab.label))
		} else {
			rendered = append(rendered, tabStyle.Render(tab.label))
		}
	}
	return lipgloss.JoinHorizontal(lipgloss.Left, rendered...)
}

func renderStatusBar(width int, current section) string {
	left := statusLeft.Render("STATUS  Ready")
	right := statusRight.Render(strings.ToUpper(sectionLabel(current)))
	gap := width - lipgloss.Width(left) - lipgloss.Width(right)
	if gap < 1 {
		return lipgloss.JoinHorizontal(lipgloss.Left, left, right)
	}
	spacer := lipgloss.NewStyle().Width(gap).Render(" ")
	return lipgloss.JoinHorizontal(lipgloss.Left, left, spacer, right)
}

func (m model) renderMenuView(listHeight, leftWidth, rightWidth, contentWidth, cardHeight int) string {
	menuPanel := panelStyle.Copy().Width(leftWidth).Height(listHeight).Render(
		lipgloss.JoinVertical(lipgloss.Left,
			panelTitle.Render("Portfolio Menu"),
			"",
			m.menu.View(),
		),
	)

	detailPanel := panelStyle.Copy().Width(rightWidth).Height(listHeight).Render(renderMenuDetail(m.menu.SelectedItem()))

	topRow := lipgloss.JoinHorizontal(lipgloss.Top, menuPanel, " ", detailPanel)
	cards := renderCards(contentWidth, cardHeight, cardsForSection(sectionMenu))
	return lipgloss.JoinVertical(lipgloss.Left, topRow, "", cards)
}

func (m model) renderProjectView(listHeight, leftWidth, rightWidth, contentWidth, cardHeight int) string {
	listView := m.projectList.View()
	if len(m.projectList.Items()) == 0 {
		listView = subtleStyle.Render("No projects available yet.")
	}
	listPanel := panelStyle.Copy().Width(leftWidth).Height(listHeight).Render(
		lipgloss.JoinVertical(lipgloss.Left,
			panelTitle.Render(sectionLabel(m.section)),
			"",
			listView,
		),
	)

	detailPanel := panelStyle.Copy().Width(rightWidth).Height(listHeight).Render(renderProjectDetail(m.projectList.SelectedItem()))
	topRow := lipgloss.JoinHorizontal(lipgloss.Top, listPanel, " ", detailPanel)
	cards := renderCards(contentWidth, cardHeight, cardsForSection(m.section))
	return lipgloss.JoinVertical(lipgloss.Left, topRow, "", cards)
}

func (m model) renderContentView(contentWidth, contentHeight int) string {
	m.viewport.Width = max(20, contentWidth-6)
	m.viewport.Height = max(8, contentHeight-2)
	contentPanel := panelStyle.Copy().Width(contentWidth).Height(contentHeight).Render(
		lipgloss.JoinVertical(lipgloss.Left,
			panelTitle.Render(sectionLabel(m.section)),
			"",
			m.viewport.View(),
		),
	)
	return contentPanel
}

func renderMenuDetail(item list.Item) string {
	selected, ok := item.(menuItem)
	if !ok {
		return subtleStyle.Render("Select a section to view details.")
	}
	return lipgloss.JoinVertical(
		lipgloss.Left,
		headerStyle.Render(selected.title),
		"",
		selected.desc,
		"",
		subtleStyle.Render("Press enter to open this section."),
	)
}

func renderProjectDetail(item list.Item) string {
	selected, ok := item.(projectItem)
	if !ok {
		return subtleStyle.Render("Pick a project to preview its details.")
	}
	project := selected.project
	lines := []string{
		headerStyle.Render(project.Title),
		subtleStyle.Render(fmt.Sprintf("%s · %s", project.Category, project.Period)),
		"",
		project.Description,
	}
	if project.Role != "" {
		lines = append(lines, "", subtleStyle.Render("Role: "+project.Role))
	}
	if len(project.Tags) > 0 {
		lines = append(lines, "", subtleStyle.Render("Tags: "+strings.Join(project.Tags, ", ")))
	}
	lines = append(lines, "", subtleStyle.Render("Press enter for full details."))
	return lipgloss.JoinVertical(lipgloss.Left, lines...)
}

func cardsForSection(current section) []card {
	switch current {
	case sectionMenu:
		return []card{
			{title: "Digital", body: "Video, audio, and photography work."},
			{title: "Physical", body: "Infrastructure and product design."},
			{title: "Contact", body: "Send a note or collaboration idea."},
		}
	case sectionDigital, sectionPhysical:
		return []card{
			{title: "Filter", body: "Press / to search by skill or title."},
			{title: "Navigate", body: "Use ↑/↓ to move between projects."},
			{title: "Details", body: "Press enter to open a full brief."},
		}
	default:
		return []card{
			{title: "Back", body: "Press esc to return to the menu."},
			{title: "Theme", body: "Terminal colors adapt automatically."},
			{title: "Tips", body: "Use q to quit anytime."},
		}
	}
}

func renderCards(width, height int, cards []card) string {
	if len(cards) == 0 {
		return ""
	}
	gap := 2
	cardWidth := max(18, (width-(gap*(len(cards)-1)))/len(cards))
	rendered := make([]string, 0, len(cards))
	for _, c := range cards {
		content := lipgloss.JoinVertical(lipgloss.Left, panelTitle.Render(c.title), "", subtleStyle.Render(c.body))
		rendered = append(rendered, cardStyle.Copy().Width(cardWidth).Height(height).Render(content))
	}
	return lipgloss.JoinHorizontal(lipgloss.Top, rendered...)
}

func sectionLabel(current section) string {
	switch current {
	case sectionMenu:
		return "Portfolio Menu"
	case sectionHome:
		return "Home"
	case sectionDigital:
		return "Digital"
	case sectionPhysical:
		return "Physical"
	case sectionDetail:
		if current == sectionDetail {
			return "Project Detail"
		}
	case sectionAbout:
		return "About"
	case sectionContact:
		return "Contact"
	}
	return "emtupr"
}

func newMenuDelegate() list.DefaultDelegate {
	delegate := list.NewDefaultDelegate()
	delegate.ShowDescription = true
	delegate.Styles.NormalTitle = delegate.Styles.NormalTitle.Foreground(mutedColor)
	delegate.Styles.NormalDesc = delegate.Styles.NormalDesc.Foreground(mutedColor)
	delegate.Styles.SelectedTitle = selectedStyle
	delegate.Styles.SelectedDesc = selectedStyle.Copy().Foreground(mutedColor)
	return delegate
}

func newProjectDelegate() list.DefaultDelegate {
	delegate := list.NewDefaultDelegate()
	delegate.ShowDescription = true
	delegate.Styles.NormalTitle = delegate.Styles.NormalTitle.Foreground(lipgloss.Color("252"))
	delegate.Styles.NormalDesc = delegate.Styles.NormalDesc.Foreground(mutedColor)
	delegate.Styles.SelectedTitle = selectedStyle
	delegate.Styles.SelectedDesc = selectedStyle.Copy().Foreground(mutedColor)
	return delegate
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
