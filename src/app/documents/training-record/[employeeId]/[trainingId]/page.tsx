
"use client";

import { useRef } from 'react';
import { notFound } from "next/navigation";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getEmployee, trainingModules } from "@/lib/data";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/icons';
import { Printer } from 'lucide-react';

export default function TrainingRecordPage({ params }: { params: { employeeId: string, trainingId: string } }) {
  const employee = getEmployee(params.employeeId);
  const training = trainingModules.find(t => t.id === params.trainingId && t.employeeId === params.employeeId);
  const documentRef = useRef<HTMLDivElement>(null);

  if (!employee || !training || training.status !== 'Completed') {
    notFound();
  }

  const handlePrint = async () => {
    const input = documentRef.current;
    if (!input) return;

    // Hide the print button before capturing
    const printButton = input.querySelector('button');
    if (printButton) printButton.style.display = 'none';

    const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better quality
    });
    const imgData = canvas.toDataURL('image/png');

    // Show the print button again
    if (printButton) printButton.style.display = 'block';

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`training-record-${employee.employeeId}-${training.name.replace(/\s+/g, '-')}.pdf`);
  };
  
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
        <div ref={documentRef} className="w-full max-w-4xl bg-white p-8 sm:p-12 shadow-lg rounded-lg text-gray-800">
            <header className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <Logo className="w-12 h-12 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-primary">AutoGuard EHS</h1>
                        <p className="text-sm text-muted-foreground">Training & Compliance</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">Training Attendance Confirmation</h2>
                    <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
                </div>
            </header>

            <main>
                <div className="mb-8 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Training Details</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <p><strong>Module:</strong> {training.name}</p>
                        <p><strong>Completion Date:</strong> {training.completionDate}</p>
                        <p><strong>Score:</strong> {training.score}%</p>
                    </div>
                </div>

                <div className="mb-8 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Employee Details</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <p><strong>Name:</strong> {fullName}</p>
                        <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                        <p><strong>Department:</strong> {employee.department}</p>
                        <p><strong>Position:</strong> {employee.position}</p>
                    </div>
                </div>

                <div className="text-sm text-muted-foreground mb-8">
                    <p className="mb-4">
                        This document confirms that the employee named above has successfully attended and completed the mandatory safety training module as specified. The employee has been instructed on the relevant safety procedures and has demonstrated satisfactory understanding, as indicated by the score achieved.
                    </p>
                    <p>
                        This record is maintained for compliance and verification purposes in accordance with internal safety policies and regulatory requirements.
                    </p>
                </div>

                <Separator className="my-8" />

                <div className="grid grid-cols-2 gap-16 mt-16 pt-8">
                    <div className="border-t-2 border-gray-400 pt-2">
                        <p className="font-semibold text-center">{fullName}</p>
                        <p className="text-sm text-muted-foreground text-center">(Employee Signature)</p>
                    </div>
                    <div className="border-t-2 border-gray-400 pt-2">
                        <p className="font-semibold text-center">EHS Department Representative</p>
                        <p className="text-sm text-muted-foreground text-center">(Authorized Signature)</p>
                    </div>
                </div>
            </main>
            
            <footer className="mt-12 text-center text-xs text-gray-400 no-print">
                <p>AutoGuard EHS - Confidential Document</p>
            </footer>

        </div>
         <div className="w-full max-w-4xl mt-4 text-right">
            <Button onClick={handlePrint} className="no-print">
                <Printer className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </div>
    </div>
  );
}
