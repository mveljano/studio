
import type { Employee, SafetyIncident, TrainingModule, PPECheckout } from '@/lib/types';
import { subDays, addDays, format } from 'date-fns';

const today = new Date();

export const employees: Employee[] = [
  { id: '1', employeeId: 'E1001', firstName: 'John', lastName: 'Doe', gender: 'Male', dateOfBirth: '1985-05-15', socialSecurityNumber: '123-456-7890', residence: '123 Main St', municipality: 'Anytown', profession: 'Mechanic', employmentDate: '2015-03-01', position: 'Assembly Line Worker', department: 'Production', email: 'john.doe@example.com', certifications: ['Forklift Operation', 'Hazardous Materials Handling'], status: 'Active' },
  { id: '2', employeeId: 'E1002', firstName: 'Jane', lastName: 'Smith', gender: 'Female', dateOfBirth: '1990-08-22', socialSecurityNumber: '234-567-8901', residence: '456 Oak Ave', municipality: 'Otherville', profession: 'Engineer', employmentDate: '2018-07-15', position: 'Quality Control Inspector', department: 'Quality Assurance', email: 'jane.smith@example.com', certifications: ['ISO 9001 Auditing', 'Six Sigma Green Belt'], status: 'Active' },
  { id: '3', employeeId: 'E1003', firstName: 'Mike', lastName: 'Johnson', gender: 'Male', dateOfBirth: '1982-11-30', socialSecurityNumber: '345-678-9012', residence: '789 Pine Ln', municipality: 'Somewhere', profession: 'Electrician', employmentDate: '2012-01-10', position: 'Maintenance Technician', department: 'Maintenance', email: 'mike.johnson@example.com', certifications: ['Electrical Safety', 'Lockout/Tagout Procedures'], status: 'Active' },
  { id: '4', employeeId: 'E1004', firstName: 'Emily', lastName: 'Davis', gender: 'Female', dateOfBirth: '1988-02-20', socialSecurityNumber: '456-789-0123', residence: '101 Maple Dr', municipality: 'Anytown', profession: 'Safety Inspector', employmentDate: '2020-09-01', position: 'EHS Manager', department: 'Safety', email: 'emily.davis@example.com', certifications: ['OSHA 30-Hour', 'Certified Safety Professional'], status: 'Active' },
  { id: '5', employeeId: 'E1005', firstName: 'Chris', lastName: 'Brown', gender: 'Male', dateOfBirth: '1992-04-12', socialSecurityNumber: '567-890-1234', residence: '212 Birch Rd', municipality: 'Otherville', profession: 'Robotics Specialist', employmentDate: '2019-11-20', position: 'Robotics Engineer', department: 'Engineering', email: 'chris.brown@example.com', certifications: ['Robot Safety Standards', 'Advanced PLC Programming'], status: 'On Leave' },
  { id: '6', employeeId: 'E1006', firstName: 'Sarah', lastName: 'Wilson', gender: 'Female', dateOfBirth: '1995-09-05', socialSecurityNumber: '678-901-2345', residence: '333 Cedar Ct', municipality: 'Somewhere', profession: 'Painter', employmentDate: '2021-02-18', position: 'Paint Shop Operator', department: 'Production', email: 'sarah.wilson@example.com', certifications: ['Respirator Fit Testing', 'Chemical Safety'], status: 'Active' },
  { id: '7', employeeId: 'E1007', firstName: 'David', lastName: 'Lee', gender: 'Male', dateOfBirth: '1989-12-10', socialSecurityNumber: '789-012-3456', residence: '444 Willow Way', municipality: 'Anytown', profession: 'Logistics Expert', employmentDate: '2017-05-25', terminationDate: '2023-10-31', position: 'Logistics Coordinator', department: 'Supply Chain', email: 'david.lee@example.com', certifications: ['Forklift Operation'], status: 'Terminated' },
  { id: '8', employeeId: 'E1008', firstName: 'Jessica', lastName: 'Miller', gender: 'Female', dateOfBirth: '1993-07-18', socialSecurityNumber: '890-123-4567', residence: '555 Spruce St', municipality: 'Otherville', profession: 'HR Generalist', employmentDate: '2022-08-01', position: 'HR Business Partner', department: 'Human Resources', email: 'jessica.miller@example.com', certifications: [], status: 'Active' },
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

export let ppeCheckouts: PPECheckout[] = [
  { id: 'ppe1', employeeId: '1', equipment: 'Safety Boots', checkoutDate: format(subDays(today, 60), 'yyyy-MM-dd'), size: '10' },
  { id: 'ppe2', employeeId: '2', equipment: 'Jacket', checkoutDate: format(subDays(today, 30), 'yyyy-MM-dd'), size: 'M' },
  { id: 'ppe3', employeeId: '6', equipment: 'Mask', checkoutDate: format(subDays(today, 15), 'yyyy-MM-dd') },
];

export let ppeEquipment: string[] = [
  'T-shirt', 'Trousers', 'Safety Boots', 'Jacket', 'Jersey', 'Winter Jacket', 'Winter Shoes',
  'Locker Keys', 'Office Shirt', 'Long-sleeve Shirt', 'Mask Filters', 'Mask', 'Protective Glasses'
];

export function getEmployee(id: string) {
  return employees.find(e => e.id === id);
}

export function getTrainingsForEmployee(employeeId: string) {
  return trainingModules.filter(t => t.employeeId === employeeId);
}

export function getIncidentsForEmployee(employeeId:string) {
  return safetyIncidents.filter(i => i.employeeId === employeeId);
}

export function addPpeCheckout(checkout: Omit<PPECheckout, 'id'>) {
  const newCheckout: PPECheckout = {
    id: `ppe${ppeCheckouts.length + 1}`,
    ...checkout,
  };
  ppeCheckouts = [...ppeCheckouts, newCheckout];
  return newCheckout;
}

export function updatePpeCheckout(updatedCheckout: PPECheckout) {
    const index = ppeCheckouts.findIndex(c => c.id === updatedCheckout.id);
    if (index === -1) {
        return { success: false, error: "Checkout record not found." };
    }
    ppeCheckouts[index] = updatedCheckout;
    return { success: true };
}

export function addPpeEquipment(equipmentName: string) {
    const trimmedName = equipmentName.trim();
    if (trimmedName === '') {
        return { success: false, error: 'Equipment name cannot be empty.' };
    }
    if (ppeEquipment.some(item => item.toLowerCase() === trimmedName.toLowerCase())) {
        return { success: false, error: `Equipment "${trimmedName}" already exists.` };
    }
    ppeEquipment = [...ppeEquipment, trimmedName].sort();
    return { success: true };
}

export function editPpeEquipment(oldName: string, newName: string) {
    const trimmedNewName = newName.trim();
    if (trimmedNewName === '') {
        return { success: false, error: 'Equipment name cannot be empty.' };
    }
    if (ppeEquipment.some(item => item.toLowerCase() === trimmedNewName.toLowerCase() && item.toLowerCase() !== oldName.toLowerCase())) {
        return { success: false, error: `Equipment "${trimmedNewName}" already exists.` };
    }
    const index = ppeEquipment.findIndex(item => item.toLowerCase() === oldName.toLowerCase());
    if (index === -1) {
        return { success: false, error: `Equipment "${oldName}" not found.` };
    }
    const updatedEquipment = [...ppeEquipment];
    updatedEquipment[index] = trimmedNewName;
    ppeEquipment = updatedEquipment.sort();

    // Also update checkouts
    ppeCheckouts = ppeCheckouts.map(checkout => 
        checkout.equipment === oldName ? { ...checkout, equipment: trimmedNewName } : checkout
    );

    return { success: true };
}

export function removePpeEquipment(equipmentName: string) {
    const index = ppeEquipment.findIndex(item => item.toLowerCase() === equipmentName.toLowerCase());
    if (index === -1) {
        return { success: false, error: `Equipment "${equipmentName}" not found.` };
    }
    // Prevent deletion if the equipment is in use
    if (ppeCheckouts.some(checkout => checkout.equipment === equipmentName)) {
        return { success: false, error: `Cannot remove "${equipmentName}" as it is currently checked out.`};
    }
    ppeEquipment = ppeEquipment.filter(item => item.toLowerCase() !== equipmentName.toLowerCase());
    return { success: true };
}
