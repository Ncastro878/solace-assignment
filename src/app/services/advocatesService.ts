import { API_BASE_URL } from '@/utils'

const ONE_MINUTE = 60

/**
 * Fetch paginated batch of advocates from the backend
 * Caches the response for 1 minute before revalidating
 */
export async function getAdvocates(
  limit: number,
  offset: number,
  searchTerm: string = ''
) {
  const queryUrl = `${API_BASE_URL}/advocates?limit=${limit}&offset=${offset}&searchTerm=${searchTerm}`
  try {
    const res = await fetch(queryUrl, { next: { revalidate: ONE_MINUTE } })
    const resJson = await res.json()
    return {
      data: resJson.data,
      totalCount:
        resJson?.data.length > 0 ? Number(resJson.data[0].totalCount) : 0,
    }
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message,
      data: [],
      totalCount: 0,
    }
  }
}
