
"use server";

import { addPpeEquipment as addPpeEquipmentData, editPpeEquipment as editPpeEquipmentData, removePpeEquipment as removePpeEquipmentData, updatePpeCheckout as updatePpeCheckoutData, addPpeInboundDelivery as addPpeInboundDeliveryData } from "@/lib/data";
import { PPECheckout, PPEEquipment, PPEInboundDelivery } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function addPpeEquipment(equipment: Omit<PPEEquipment, 'id' | 'stock'>) {
  try {
    const result = addPpeEquipmentData(equipment);
    if (result.success) {
      revalidatePath("/ppe");
      revalidatePath("/ppe/inventory");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error adding PPE equipment:", error);
    return { success: false, error: "Failed to add equipment." };
  }
}

export async function editPpeEquipment(equipmentId: string, equipmentData: Partial<Omit<PPEEquipment, 'id' | 'stock'>>) {
    try {
      const result = editPpeEquipmentData(equipmentId, equipmentData);
      if (result.success) {
        revalidatePath("/ppe");
        revalidatePath("/ppe/inventory");
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error editing PPE equipment:", error);
      return { success: false, error: "Failed to edit equipment." };
    }
  }
  
  export async function removePpeEquipment(equipmentId: string) {
    try {
      const result = removePpeEquipmentData(equipmentId);
      if (result.success) {
        revalidatePath("/ppe");
        revalidatePath("/ppe/inventory");
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error removing PPE equipment:", error);
      return { success: false, error: "Failed to remove equipment." };
    }
  }

  export async function updatePpeCheckout(checkout: PPECheckout) {
    try {
      const result = updatePpeCheckoutData(checkout);
      if (result.success) {
        revalidatePath("/ppe");
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error updating PPE checkout:", error);
      return { success: false, error: "Failed to update checkout record." };
    }
  }

  export async function addPpeInboundDelivery(delivery: Omit<PPEInboundDelivery, 'id' | 'deliveryDate'>) {
    try {
      const result = addPpeInboundDeliveryData(delivery);
      if (result.success) {
        revalidatePath('/ppe/inventory');
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error("Error adding inbound delivery:", error);
      return { success: false, error: "Failed to add delivery." };
    }
  }
