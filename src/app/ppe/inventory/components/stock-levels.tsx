"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PPEEquipment } from "@/lib/types";

type StockLevelsProps = {
  equipment: PPEEquipment[];
  className?: string;
};

export function StockLevels({ equipment, className }: StockLevelsProps) {
  const getMaxStock = () => {
    if (equipment.length === 0) return 100;
    return Math.max(...equipment.map(e => e.stock), 100);
  }
  const maxStock = getMaxStock();
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Current Stock Levels</CardTitle>
        <CardDescription>
          An overview of the quantity on hand for each PPE item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Equipment</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                    <Progress value={(item.stock / maxStock) * 100} className="w-full" />
                </TableCell>
                <TableCell className="text-right font-mono">{item.stock}</TableCell>
              </TableRow>
            ))}
             {equipment.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">No equipment defined.</TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
