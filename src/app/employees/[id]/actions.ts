"use server";

import { suggestTrainingRemediation, TrainingRemediationInput } from "@/ai/flows/training-remediation-suggestions";

export async function getRemediationSuggestions(input: TrainingRemediationInput) {
  try {
    const result = await suggestTrainingRemediation(input);
    return { success: true, suggestions: result.remediationSuggestions };
  } catch (error) {
    console.error("Error getting remediation suggestions:", error);
    return { success: false, error: "Failed to generate suggestions." };
  }
}
