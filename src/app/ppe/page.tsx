
import { employees, ppeCheckouts, ppeEquipment } from "@/lib/data";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { AddPpeCheckoutForm } from "./components/add-ppe-checkout-form";
import { ManagePpeEquipment } from "./components/manage-ppe-equipment";

export default async function PpePage() {
  const checkoutData = ppeCheckouts.map(checkout => {
    const employee = employees.find(e => e.id === checkout.employeeId);
    return {
      ...checkout,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <AddPpeCheckoutForm employees={employees} ppeEquipment={ppeEquipment} />
        <DataTable columns={columns} data={checkoutData} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <ManagePpeEquipment equipment={ppeEquipment} />
      </div>
    </div>
  );
}
