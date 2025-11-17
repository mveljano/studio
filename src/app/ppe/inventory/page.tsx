import { getPpeEquipment, getPpeInboundDeliveries } from "@/lib/data";
import { AddPpeDeliveryForm } from "./components/add-delivery-form";
import { StockLevels } from "./components/stock-levels";
import { DeliveryHistory } from "./components/delivery-history";

export default async function PpeInventoryPage() {
  const equipment = getPpeEquipment();
  const deliveries = getPpeInboundDeliveries();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <StockLevels equipment={equipment} />
            <DeliveryHistory deliveries={deliveries} equipment={equipment} />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <AddPpeDeliveryForm equipment={equipment} />
        </div>
    </div>
  );
}
