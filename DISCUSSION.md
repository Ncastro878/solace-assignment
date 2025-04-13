
We have a DB of potentially 100k's of Advocates. Our users need to be able to view and search through that large list in an easy and optimal way; we don't want to force them to think. 


Follow-up Optimizations:
- Add db indexes to columns (top contenders: first_name, last_name, city )
   - (Research GIN indexes for specialties column of JSONB for faster LIKE searches )
- Pagination on table to handle displaying 100k's of results
- Unit tests (BE + FE)