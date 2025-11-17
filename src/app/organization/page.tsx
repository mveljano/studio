import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { departments } from "@/lib/data";
import { Building2, Briefcase } from "lucide-react";

export default function OrganizationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizational Structure</CardTitle>
        <CardDescription>
          An overview of all departments and the positions within them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {departments.map((department) => (
            <AccordionItem value={department.name} key={department.name}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">{department.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2 pl-8">
                  {department.positions.map((position) => (
                    <li key={position} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{position}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
