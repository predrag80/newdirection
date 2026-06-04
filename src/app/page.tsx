const projects = [
  {
    id: "strategy",
    title: "Strategy Sprint",
    category: "Planning",
    summary: "Focused discovery, positioning, and launch priorities for early-stage initiatives."
  },
  {
    id: "digital",
    title: "Digital Presence",
    category: "Web",
    summary: "Static websites, landing pages, and project pages built for clarity and fast delivery."
  },
  {
    id: "operations",
    title: "Operational Systems",
    category: "Workflow",
    summary: "Practical internal tools and structured processes for teams that need momentum."
  }
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="New Direction home">
          New Direction
        </a>
        <nav aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-content">
          <p className="eyebrow">Static landing page</p>
          <h1>New Direction</h1>
          <p>
            A lightweight presentation site with a focused landing page and direct links to
            single-view project sections.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">
              View projects
            </a>
            <a className="button secondary" href="#contact">
              Start a conversation
            </a>
          </div>
        </div>
      </section>

      <section className="section intro" aria-label="Positioning">
        <p>
          The structure is intentionally simple: one landing view, anchored project sections,
          static assets in `public/`, and a generated `out/` folder that Nginx can serve directly.
        </p>
      </section>

      <section className="section" id="projects">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2>Project views</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" id={project.id} key={project.id}>
              <span>{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <a href={`#${project.id}`}>Open view</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Ready for content and visual direction.</h2>
        </div>
        <a className="button primary" href="mailto:hello@newdirection.local">
          hello@newdirection.local
        </a>
      </section>
    </main>
  );
}
