
"use server";

import { addPpeEquipment as addPpeEquipmentData } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function addPpeEquipment(equipmentName: string) {
  try {
    const result = addPpeEquipmentData(equipmentName);
    if (result.success) {
      revalidatePath("/ppe");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error adding PPE equipment:", error);
    return { success: false, error: "Failed to add equipment." };
  }
}
