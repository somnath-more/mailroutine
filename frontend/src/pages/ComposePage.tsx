import { Send } from 'lucide-react'

import { PageHeader } from '../components/molecules/PageHeader/PageHeader'

export function ComposePage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Delivery"
        title="Compose"
        description="Build and review a message before confirming its recipients."
      />
      <section className="empty-state">
        <Send size={28} strokeWidth={1.6} aria-hidden="true" />
        <h2>Compose workspace scaffolded</h2>
        <p>No sender, template, recipient, or email behavior is active yet.</p>
      </section>
    </div>
  )
}
