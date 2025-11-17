
import { employees, ppeCheckouts } from "@/lib/data";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { AddPpeCheckoutForm } from "./components/add-ppe-checkout-form";

export default async function PpePage() {
  const data = ppeCheckouts.map(checkout => {
    const employee = employees.find(e => e.id === checkout.employeeId);
    return {
      ...checkout,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
    };
  });

  return (
    <div className="space-y-6">
        <AddPpeCheckoutForm />
        <DataTable columns={columns} data={data} />
    </div>
  );
}
