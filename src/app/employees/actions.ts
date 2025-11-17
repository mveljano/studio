"use server";

import { revalidatePath } from "next/cache";
import { addEmployee, updateEmployee } from "@/lib/data";
import { Employee } from "@/lib/types";

type AddEmployeeInput = Omit<Employee, "id" | "certifications" | "terminationDate">;

export async function addEmployeeAction(employeeData: AddEmployeeInput) {
    try {
        const result = addEmployee(employeeData);
        if (result.success) {
          revalidatePath("/employees");
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        console.error("Error adding employee:", error);
        return { success: false, error: "Failed to add employee." };
      }
}
