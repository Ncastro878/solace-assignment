import Table from "./components/table";
import { dbDefaultLimit, dbDefaultOffset, API_BASE_URL } from "@/utils";
import { getAdvocates } from "./services/advocatesService";

export default async function Home() {
  const { data: initialAdvocates, totalCount } = await getAdvocates(dbDefaultLimit, dbDefaultOffset);
  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <Table initialAdvocates={initialAdvocates} initialTotalCount={totalCount} />
    </main>
  );
}
