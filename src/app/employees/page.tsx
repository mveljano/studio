
"use client"

import { useState } from "react";
import { getEmployees } from "@/lib/data"
import { DataTable } from "./components/data-table"
import { Employee } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddEmployeeDialog } from "./components/add-employee-dialog"
import { EditEmployeeDialog } from "./components/edit-employee-dialog";

type EmployeeRow = Employee & { name: string };

export default function EmployeesPage() {
  const data: EmployeeRow[] = getEmployees().map(e => ({
    ...e,
    name: `${e.firstName} ${e.lastName}`,
  }));
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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
      <DataTable 
        data={data} 
        onEdit={(employee) => setEditingEmployee(employee)} 
      />
      {editingEmployee && (
        <EditEmployeeDialog
          employee={editingEmployee}
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}
    </div>
  )
}
