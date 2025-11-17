import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  export default function TrainingsPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trainings</CardTitle>
          <CardDescription>
            Manage all training modules for the organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned Employees</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        Training module management coming soon.
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  