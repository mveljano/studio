import { getEmployees } from "@/lib/data"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { Employee } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddEmployeeDialog } from "./components/add-employee-dialog"

type EmployeeRow = Employee & { name: string };

export default async function EmployeesPage() {
  const data: EmployeeRow[] = getEmployees().map(e => ({
    ...e,
    name: `${e.firstName} ${e.lastName}`,
  }));

  return (
    <div className="space-y-4">
       <div className="flex justify-end">
        <AddEmployeeDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
            </Button>
        </AddEmployeeDialog>
       </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
