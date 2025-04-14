We have a DB of potentially 100k's of Advocates. Our users need to be able to view and search through that large list in an easy and optimal way; we don't want to force them to think. 

Considerations on my submissions:
- I wanted to split up my PR's to more managable sizes (as all PR's should be for review) so they could be more thematically unified, and easier to understand,
otherwise 1 large unwieldy PR would be harder to parse. But I wanted each PR to build on top of previous changes and optimizations, so that there could be a 
final product with all changers merged into 1, thus I merged my PR's into `main` and branched off each time. Otherwise each PR would have to work off the initial messy state
of the app, and the changes would've be a little more disjointed. A final product seemed preferable.  

Follow-up Features & Optimizations:
- Unit tests (BE + FE)  
- Input Validation (Zod library)
- Add FE Error handling for displaying user friendly error msgs
- Format phone numbers when displayed in table
- Revalidate cache for /advocates path when advocates upserted or deleted
- Add db indexes to columns (top contenders: first_name, last_name, city )
   - (Research GIN indexes for 'specialties' column of JSONB for faster LIKE searches)