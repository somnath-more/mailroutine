const foundationItems = ['React + TypeScript', 'FastAPI', 'PostgreSQL-ready']

function App() {
  return (
    <main className="setup-shell">
      <section className="setup-card" aria-labelledby="page-title">
        <p className="eyebrow">Bulk email workspace</p>
        <h1 id="page-title">Careerflow</h1>
        <p className="status" role="status">
          <span className="status-dot" aria-hidden="true" />
          Project foundation is ready.
        </p>
        <p className="summary">
          The first release will focus on importing recipients, viewing them
          clearly, and sending deliberate individual emails.
        </p>
        <ul className="foundation-list" aria-label="Configured foundation">
          {foundationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
