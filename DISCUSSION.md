
We have a DB of potentially 100k's of Advocates. Our users need to be able to view and search through that large list in an easy and optimal way; we don't want to force them to think. 


Follow-up Features & Optimizations:
- Unit tests (BE + FE)  
- Add FE Error handling for displaying user friendly error msgs
- Format phone numbers when displayed in table
- Revalidate cache for /advocates path when advocates upserted or deleted
- Input Validation (Zod library)
- Add db indexes to columns (top contenders: first_name, last_name, city )
   - (Research GIN indexes for 'specialties' column of JSONB for faster LIKE searches)
-