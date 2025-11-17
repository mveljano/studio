import { getEmployees, getPpeCheckouts, getPpeEquipment, getPpeStock } from "@/lib/data";
import { columns } from "./components/checkout-columns";
import { CheckoutDataTable } from "./components/checkout-data-table";
import { AddPpeCheckoutForm } from "./components/add-ppe-checkout-form";
import { ManagePpeEquipment } from "./components/manage-ppe-equipment";

export default async function PpePage() {
  const checkouts = getPpeCheckouts();
  const employees = getEmployees();
  const equipment = getPpeEquipment();
  const stock = getPpeStock();

  const checkoutData = checkouts.map(checkout => {
    const employee = employees.find(e => e.id === checkout.employeeId);
    const equipmentItem = equipment.find(eq => eq.id === checkout.equipmentId);
    return {
      ...checkout,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
      employeeId: employee?.employeeId || 'Unknown',
      equipmentName: equipmentItem?.name || 'Unknown',
      renewalMonths: equipmentItem?.renewalMonths || 0,
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <AddPpeCheckoutForm employees={employees} ppeEquipment={equipment} ppeStock={stock} />
        <CheckoutDataTable columns={columns} data={checkoutData} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <ManagePpeEquipment equipment={equipment} />
      </div>
    </div>
  );
}
