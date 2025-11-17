import { getEmployees } from "@/lib/data"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { Employee } from "@/lib/types"

type EmployeeRow = Employee & { name: string };

export default async function EmployeesPage() {
  const data: EmployeeRow[] = getEmployees().map(e => ({
    ...e,
    name: `${e.firstName} ${e.lastName}`,
  }));

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
