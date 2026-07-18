## dev environment
Language: TypeScript (^5.0.0)
Framework: Next.js 16.2 (App Router)
Styling: Tailwind CSS
Component Library: shadcn/ui
Package Manager: npm (preferred)

## project structure
app/
    components/              # all custom components
        ui/                  # all shadcn components
    ...
README.md                # conceptual project documentation

## libraries used
State Management: Zustand
NLP-Stack: chrono-node, rrule, parse-duration
Drag-and-drop: dnd-kit (Sortable Tree) 
Animation: Motion (Framer Motion)
Explicit current constraints: no backend, no auth, no db, no user management. Storage managed using localStorage currently.
Deployment: Vercel