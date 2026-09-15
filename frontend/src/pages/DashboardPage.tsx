import { FileUp, ListChecks, Send } from 'lucide-react'

import { PageHeader } from '../components/molecules/PageHeader/PageHeader'

const launchSteps = [
  {
    icon: FileUp,
    label: 'Bulk import',
    description:
      'Bring recipient email addresses in from a validated text file.',
  },
  {
    icon: ListChecks,
    label: 'Review recipients',
    description:
      'Search, filter, and choose exactly who should receive a message.',
  },
  {
    icon: Send,
    label: 'Send deliberately',
    description:
      'Review every campaign before sending one email per recipient.',
  },
]

export function DashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Email workspace"
        title="Careerflow"
        description="A focused foundation for safe, understandable bulk email workflows."
      />

      <section className="readiness-card" aria-labelledby="readiness-title">
        <span className="status-dot" aria-hidden="true" />
        <div>
          <h2 id="readiness-title">Project foundation is ready.</h2>
          <p>The layout and theme system are prepared for feature work.</p>
        </div>
      </section>

      <section className="launch-grid" aria-label="Initial release workflow">
        {launchSteps.map(({ icon: Icon, label, description }, index) => (
          <article className="launch-card" key={label}>
            <div className="launch-card__topline">
              <span className="launch-card__icon" aria-hidden="true">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="launch-card__step">0{index + 1}</span>
            </div>
            <h2>{label}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
