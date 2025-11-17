"use server";

import { revalidatePath } from "next/cache";
import { addDepartment, editDepartment, removeDepartment, addPosition, editPosition, removePosition } from "@/lib/data";

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

export async function addPositionAction(departmentName: string, positionName: string) {
  const result = addPosition(departmentName, positionName);
  if (result.success) {
    revalidatePath("/organization");
  }
  return result;
}

export async function editPositionAction(departmentName: string, oldName: string, newName: string) {
  const result = editPosition(departmentName, oldName, newName);
  if (result.success) {
    revalidatePath("/organization");
    revalidatePath("/employees");
  }
  return result;
}

export async function removePositionAction(departmentName: string, positionName: string) {
  const result = removePosition(departmentName, positionName);
  if (result.success) {
    revalidatePath("/organization");
  }
  return result;
}
