import type { Employee, SafetyIncident, TrainingModule } from '@/lib/types';
import { subDays, addDays, format } from 'date-fns';

const today = new Date();

export const employees: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', jobRole: 'Assembly Line Worker', department: 'Production', avatar: '1', certifications: ['Forklift Operation', 'Hazardous Materials Handling'], status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', jobRole: 'Quality Control Inspector', department: 'Quality Assurance', avatar: '2', certifications: ['ISO 9001 Auditing', 'Six Sigma Green Belt'], status: 'Active' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', jobRole: 'Maintenance Technician', department: 'Maintenance', avatar: '3', certifications: ['Electrical Safety', 'Lockout/Tagout Procedures'], status: 'Active' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', jobRole: 'EHS Manager', department: 'Safety', avatar: '4', certifications: ['OSHA 30-Hour', 'Certified Safety Professional'], status: 'Active' },
  { id: '5', name: 'Chris Brown', email: 'chris.brown@example.com', jobRole: 'Robotics Engineer', department: 'Engineering', avatar: '5', certifications: ['Robot Safety Standards', 'Advanced PLC Programming'], status: 'On Leave' },
  { id: '6', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', jobRole: 'Paint Shop Operator', department: 'Production', avatar: '6', certifications: ['Respirator Fit Testing', 'Chemical Safety'], status: 'Active' },
  { id: '7', name: 'David Lee', email: 'david.lee@example.com', jobRole: 'Logistics Coordinator', department: 'Supply Chain', avatar: '7', certifications: ['Forklift Operation'], status: 'Terminated' },
  { id: '8', name: 'Jessica Miller', email: 'jessica.miller@example.com', jobRole: 'HR Business Partner', department: 'Human Resources', avatar: '8', certifications: [], status: 'Active' },
];

export const trainingModules: TrainingModule[] = [
  // John Doe
  { id: 't1', employeeId: '1', name: 'Safety Harness Training', dueDate: format(subDays(today, 10), 'yyyy-MM-dd'), status: 'Overdue', score: undefined },
  { id: 't2', employeeId: '1', name: 'Ergonomics in Assembly', dueDate: format(addDays(today, 5), 'yyyy-MM-dd'), status: 'In Progress' },
  { id: 't3', employeeId: '1', name: 'Annual Fire Safety', dueDate: format(subDays(today, 30), 'yyyy-MM-dd'), status: 'Completed', completionDate: format(subDays(today, 32), 'yyyy-MM-dd'), score: 95 },
  // Jane Smith
  { id: 't4', employeeId: '2', name: 'Advanced Product Testing', dueDate: format(addDays(today, 20), 'yyyy-MM-dd'), status: 'Not Started' },
  { id: 't5', employeeId: '2', name: 'Data Integrity and Reporting', dueDate: format(subDays(today, 5), 'yyyy-MM-dd'), status: 'Completed', completionDate: format(subDays(today, 6), 'yyyy-MM-dd'), score: 100 },
  // Mike Johnson
  { id: 't6', employeeId: '3', name: 'High-Voltage Battery Safety', dueDate: format(subDays(today, 2), 'yyyy-MM-dd'), status: 'Overdue', score: undefined },
  { id: 't7', employeeId: '3', name: 'Machine Guarding', dueDate: format(addDays(today, 30), 'yyyy-MM-dd'), status: 'In Progress' },
  // Emily Davis
  { id: 't8', employeeId: '4', name: 'Incident Investigation Leadership', dueDate: format(subDays(today, 15), 'yyyy-MM-dd'), status: 'Completed', completionDate: format(subDays(today, 16), 'yyyy-MM-dd'), score: 98 },
  // Chris Brown
  { id: 't9', employeeId: '5', name: 'Collaborative Robot Safety', dueDate: format(addDays(today, 10), 'yyyy-MM-dd'), status: 'Not Started' },
  // Sarah Wilson
  { id: 't10', employeeId: '6', name: 'VOC Emission Control', dueDate: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'In Progress' },
  { id: 't11', employeeId: '6', name: 'Personal Protective Equipment (PPE)', dueDate: format(subDays(today, 45), 'yyyy-MM-dd'), status: 'Completed', completionDate: format(subDays(today, 45), 'yyyy-MM-dd'), score: 90 },
];

export const safetyIncidents: SafetyIncident[] = [
  { id: 's1', employeeId: '1', date: format(subDays(today, 40), 'yyyy-MM-dd'), description: 'Minor slip on wet floor, no injury.', type: 'Near Miss' },
  { id: 's2', employeeId: '6', date: format(subDays(today, 90), 'yyyy-MM-dd'), description: 'Incorrect chemical mixture led to paint batch disposal.', type: 'Property Damage' },
  { id: 's3', employeeId: '3', date: format(subDays(today, 120), 'yyyy-MM-dd'), description: 'Minor cut on hand from exposed wiring.', type: 'Injury' },
];

export function getEmployee(id: string) {
  return employees.find(e => e.id === id);
}

export function getTrainingsForEmployee(employeeId: string) {
  return trainingModules.filter(t => t.employeeId === employeeId);
}

export function getIncidentsForEmployee(employeeId: string) {
  return safetyIncidents.filter(i => i.employeeId === employeeId);
}
