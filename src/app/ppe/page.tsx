
import { getEmployees, getPpeCheckouts, getPpeEquipment } from "@/lib/data";
import { columns } from "./components/checkout-columns";
import { CheckoutDataTable } from "./components/checkout-data-table";
import { AddPpeCheckoutForm } from "./components/add-ppe-checkout-form";
import { StockLevels } from "./inventory/components/stock-levels";

export default async function PpePage() {
  const checkouts = getPpeCheckouts();
  const employees = getEmployees();
  const equipment = getPpeEquipment();
  
  const stock = equipment.reduce((acc, item) => {
    acc[item.id] = item.stock;
    return acc;
  }, {} as Record<string, number>);

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
    <div className="space-y-6">
      <StockLevels equipment={equipment} />
      <AddPpeCheckoutForm employees={employees} ppeEquipment={equipment} ppeStock={stock} />
      <CheckoutDataTable columns={columns} data={checkoutData} />
    </div>
  );
}
