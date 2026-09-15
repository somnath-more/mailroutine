import { Users } from 'lucide-react'

import { PageHeader } from '../components/molecules/PageHeader/PageHeader'

export function RecipientsPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Audience"
        title="Recipients"
        description="Import and review the people you plan to contact."
      />
      <section className="empty-state">
        <Users size={28} strokeWidth={1.6} aria-hidden="true" />
        <h2>Recipient workspace scaffolded</h2>
        <p>
          Bulk import and the recipient table arrive in their dedicated feature
          branches.
        </p>
      </section>
    </div>
  )
}
