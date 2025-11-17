import { employees } from "@/lib/data"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export default async function EmployeesPage() {
  const data = employees;

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
