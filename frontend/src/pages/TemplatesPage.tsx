import { FileText } from 'lucide-react'

import { PageHeader } from '../components/molecules/PageHeader/PageHeader'

export function TemplatesPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Reusable content"
        title="Templates"
        description="Prepare consistent subjects, message bodies, and attachments."
      />
      <section className="empty-state">
        <FileText size={28} strokeWidth={1.6} aria-hidden="true" />
        <h2>Template workspace scaffolded</h2>
        <p>
          Template creation and version-safe attachments are not implemented on
          this branch.
        </p>
      </section>
    </div>
  )
}
