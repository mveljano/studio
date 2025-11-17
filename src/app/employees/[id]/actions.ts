"use server";

import { revalidatePath } from "next/cache";
import { suggestTrainingRemediation, TrainingRemediationInput } from "@/ai/flows/training-remediation-suggestions";
import { updateEmployee } from "@/lib/data";
import { Employee } from "@/lib/types";

export async function getRemediationSuggestions(input: TrainingRemediationInput) {
  try {
    const result = await suggestTrainingRemediation(input);
    return { success: true, suggestions: result.remediationSuggestions };
  } catch (error) {
    console.error("Error getting remediation suggestions:", error);
    return { success: false, error: "Failed to generate suggestions." };
  }
}

export async function updateEmployeeAction(employee: Employee) {
  try {
    const result = updateEmployee(employee);
    if (result.success) {
      revalidatePath(`/employees/${employee.id}`);
      revalidatePath("/employees");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    return { success: false, error: "Failed to update employee." };
  }
}
