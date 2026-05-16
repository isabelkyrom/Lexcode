<!-- BEGIN:nextjs-agent-rules -->
# Coding Agent Instructions for Ciberdemocracia

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database/Auth: Supabase
- Validation: Zod + React Hook Form
- Blockchain: Thirdweb SDK + Ethers v5

## Coding Standards
1. **Server Components**: Use Server Components by default. Only use `'use client'` when necessary for interactivity (hooks, event listeners).
2. **Security**: Never expose Supabase `service_role` keys. Always use environment variables.
3. **Validation**: Use Zod schemas for all form inputs and API responses.
4. **Icons**: Use `lucide-react`.
5. **Data Fetching**: Use standard `fetch` with Next.js caching or Supabase server-side clients.
<!-- END:nextjs-agent-rules -->
