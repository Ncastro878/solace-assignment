import db from '../../../db'
import { advocates } from '../../../db/schema'
import { advocateData } from '../../../db/seed/advocates'
import { dbDefaultLimit, dbDefaultOffset } from '../../../utils'
import { sql } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchTerm, limit, offset } = extractQueryParams(request)

  const useMockData = process.env.MOCK_DB_DATA || !process.env.DATABASE_URL
  if (useMockData) {
    const data = simulateMockPaginatedQuery(limit, offset, searchTerm)
    return Response.json({ data })
  }

  try {
    let data
    if (!!searchTerm) {
      data = await fetchAdvocatesWithSearchTerm(searchTerm, limit, offset)
    } else {
      data = await fetchAdvocates(limit, offset)
    }
    return Response.json({ data })
  } catch (error: any) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Fetch paginated batch of advocates w/ search term & return total count of advocates
 * that match the search term in the db
 */
async function fetchAdvocatesWithSearchTerm(
  searchTerm: string,
  limit: number,
  offset: number
) {
  return db
    .select({
      ...advocates,
      totalCount: sql<number>`count(*) over()`,
    })
    .from(advocates)
    .where(
      sql`LOWER(${advocates.firstName}) LIKE LOWER(${`%${searchTerm}%`}) OR 
          LOWER(${advocates.lastName}) LIKE LOWER(${`%${searchTerm}%`}) OR 
          LOWER(${advocates.city}) LIKE LOWER(${`%${searchTerm}%`}) OR 
          LOWER(${advocates.degree}) LIKE LOWER(${`%${searchTerm}%`}) OR 
          LOWER(${
            advocates.specialties
          }::text) LIKE LOWER(${`%${searchTerm}%`}) OR
          LOWER(${
            advocates.yearsOfExperience
          }::text) LIKE LOWER(${`%${searchTerm}%`})`
    )
    .limit(limit)
    .offset(offset)
}

/**
 * Fetch paginated batch of advocates & return total count of advocates in db
 */
async function fetchAdvocates(limit: number, offset: number) {
  return db
    .select({
      ...advocates,
      totalCount: sql<number>`count(*) over()`,
    })
    .from(advocates)
    .limit(limit)
    .offset(offset)
}

function extractQueryParams(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : dbDefaultLimit
  const offset = searchParams.get('offset')
    ? Number(searchParams.get('offset'))
    : dbDefaultOffset
  const searchTerm = searchParams.get('searchTerm')
    ? searchParams.get('searchTerm')
    : ''

  return { searchTerm, limit, offset }
}

// Mock our paginated db query on mock advocate data for UI pagination functionality
function simulateMockPaginatedQuery(
  limit: number,
  offset: number,
  searchTerm: string | null
) {
  let data = advocateData
  if (!!searchTerm) {
    data = data.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties.some((specialty: string) =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      )
    })
  }
  data = data.map((advocate) => ({
    ...advocate,
    totalCount: data.length,
  }))
  data = data.slice(offset, offset + limit)
  return data
}
