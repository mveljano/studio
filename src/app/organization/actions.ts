
"use server";

import { revalidatePath } from "next/cache";
import { addDepartment, editDepartment, removeDepartment, addPosition as addPositionData, editPosition as editPositionData, removePosition as removePositionData } from "@/lib/data";
import { Position } from "@/lib/types";

export async function addDepartmentAction(departmentName: string) {
  const result = addDepartment(departmentName);
  if (result.success) {
    revalidatePath("/organization");
  }
  return result;
}

export async function editDepartmentAction(oldName: string, newName: string) {
  const result = editDepartment(oldName, newName);
  if (result.success) {
    revalidatePath("/organization");
    revalidatePath("/employees");
  }
  return result;
}

export async function removeDepartmentAction(departmentName: string) {
  const result = removeDepartment(departmentName);
  if (result.success) {
    revalidatePath("/organization");
  }
  return result;
}

export async function addPositionAction(departmentName: string, positionData: Omit<Position, 'id' | 'subPositions'>, parentId?: string | null) {
  const result = addPositionData(departmentName, positionData, parentId);
  if (result.success) {
    revalidatePath("/organization");
  }
  return result;
}

export async function editPositionAction(departmentName: string, positionId: string, positionData: Partial<Omit<Position, 'id' | 'subPositions'>>) {
    const result = editPositionData(departmentName, positionId, positionData);
    if (result.success) {
      revalidatePath("/organization");
      revalidatePath("/employees");
    }
    return result;
}

export async function removePositionAction(departmentName: string, positionName: string) {
  const result = removePositionData(departmentName, positionName);
  if (result.success) {
    revalidatePath("/organization");
  }
  return result;
}
