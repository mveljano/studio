
"use server";

import { addPpeEquipment as addPpeEquipmentData, editPpeEquipment as editPpeEquipmentData, removePpeEquipment as removePpeEquipmentData } from "@/lib/data";
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

export async function editPpeEquipment(oldName: string, newName: string) {
    try {
      const result = editPpeEquipmentData(oldName, newName);
      if (result.success) {
        revalidatePath("/ppe");
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error editing PPE equipment:", error);
      return { success: false, error: "Failed to edit equipment." };
    }
  }
  
  export async function removePpeEquipment(equipmentName: string) {
    try {
      const result = removePpeEquipmentData(equipmentName);
      if (result.success) {
        revalidatePath("/ppe");
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error removing PPE equipment:", error);
      return { success: false, error: "Failed to remove equipment." };
    }
  }
