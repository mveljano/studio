"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getRemediationSuggestions } from "../actions";
import { Loader2, Sparkles } from "lucide-react";
import { TrainingRemediationInput } from "@/ai/flows/training-remediation-suggestions";

type RemediationDialogProps = TrainingRemediationInput;

export default function RemediationDialog(props: RemediationDialogProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSuggestions("");
    const result = await getRemediationSuggestions(props);
    if (result.success) {
      setSuggestions(result.suggestions || "No suggestions were generated.");
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Suggest Remediation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            Remediation Suggestions
          </DialogTitle>
          <DialogDescription>
            AI-powered suggestions to help {props.employeeName} complete the '{props.trainingName}' training.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : suggestions ? (
            <div className="prose prose-sm max-w-none rounded-md border bg-muted/50 p-4 whitespace-pre-wrap">
              {suggestions}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Click "Generate" to get suggestions.
            </div>
          )}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
