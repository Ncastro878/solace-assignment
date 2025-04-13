import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const setup = () => {
  // Hacky temp workaround so the mock db can chain limit(), offset(), where() when envvars not set
  // This helps avoid type errors during development and allows us to 'run npm run build'
  // TODO: Refactor a cleaner mock - possibly use envvars to check if local or prod instead
  if (!process.env.DATABASE_URL || process.env.MOCK_DB_DATA) {
    console.error('DATABASE_URL is not set or MOCK_DB_DATA is true')
    return {
      select: (q?: any) => ({
        from: () => ({
          limit: (n: number) => ({
            offset: (m: number) => [],
          }),
          where: (q?: any) => ({
            limit: (n: number) => ({
              offset: (m: number) => [],
            }),
          }),
        }),
      }),
      insert: (q?: any) => ({
        values: (q?: any) => ({
          returning: (q?: any) => [],
        }),
      }),
    }
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL)
  const db = drizzle(queryClient)
  return db
}

export default setup()
