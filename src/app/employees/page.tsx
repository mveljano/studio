import { getEmployees } from "@/lib/data"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { Employee } from "@/lib/types"

export default async function EmployeesPage() {
  const data: (Employee & { name: string })[] = getEmployees().map(e => ({
    ...e,
    name: `${e.firstName} ${e.lastName}`,
  }));

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
