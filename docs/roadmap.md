# Careerflow roadmap

Careerflow is developed one focused branch at a time. A branch is verified and documented before the next feature begins.

## Current foundation

1. `project-setup` — React/Vite/TypeScript frontend, FastAPI backend, local PostgreSQL configuration, quality tooling, and CI. This is the user-requested branch name corresponding to the planned `chore/project-setup` milestone.

## Initial email release

2. `feat/theme-layout`
3. `feat/database-foundation`
4. `feat/authentication`
5. `feat/users-rbac`
6. `feat/sender-configuration`
7. `feat/files-attachments`
8. `feat/email-templates`
9. `feat/recipient-import`
10. `feat/recipient-table`
11. `feat/email-compose`
12. `feat/email-worker`
13. `feat/email-history`
14. `chore/email-release`

The first launch centers on bulk recipient import, recipient viewing, and deliberate individual email sending. The supporting authentication, permissions, sender, template, attachment, worker, and immutable-history milestones exist to make those three workflows safe and operational.

## Career release

15. `feat/candidate-profile`
16. `feat/job-import`
17. `feat/job-connectors`
18. `feat/job-discovery`
19. `feat/ai-fit-evaluation`
20. `feat/application-studio`
21. `feat/document-export`
22. `feat/application-tracker`
23. `feat/ai-assistant`
24. `chore/career-release`

Career tooling begins only after the email release is stable. Subscription and billing features are later work and are not assigned to a branch yet.
