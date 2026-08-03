import { defineConfig } from 'drizzle-kit'

if (!process.env.DB_URL) {
  throw new Error('DB_URL is not defined')
}

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
  schema: 'src/db/schema/*',
  out: 'src/db/migrations',
  casing: 'snake_case',
})