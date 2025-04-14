import Table from "./components/table";
import { dbDefaultLimit, dbDefaultOffset, API_BASE_URL } from "@/utils";
import { getAdvocates } from "./services/advocatesService";

export default async function Home() {
  const { data: initialAdvocates, totalCount } = await getAdvocates(dbDefaultLimit, dbDefaultOffset);
  return (
    <main style={{ margin: "24px", fontFamily: "sans-serif" }}>
      <div className="flex items-center justify-center border-b-2 border-[#285e50] pb-[10px]">
        <h1 className="text-[#285e50] font-bold text-2xl">Solace Advocates</h1>
      </div>
      <br />
      <br />
      <Table initialAdvocates={initialAdvocates} initialTotalCount={totalCount} />
    </main>
  );
}
