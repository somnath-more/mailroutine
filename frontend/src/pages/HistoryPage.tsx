import { History } from 'lucide-react'

import { PageHeader } from '../components/molecules/PageHeader/PageHeader'

export function HistoryPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Audit trail"
        title="History"
        description="Understand what was prepared, attempted, accepted, or failed."
      />
      <section className="empty-state">
        <History size={28} strokeWidth={1.6} aria-hidden="true" />
        <h2>History workspace scaffolded</h2>
        <p>
          Immutable message and attempt records begin with the email-history
          feature.
        </p>
      </section>
    </div>
  )
}
