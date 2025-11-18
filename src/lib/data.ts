
import type { Employee, SafetyIncident, TrainingModule, PPECheckout, Department, Position, RiskAndMeasure, PPEEquipment, PPEInboundDelivery } from '@/lib/types';
import { subDays, addDays, format, subMonths } from 'date-fns';

const today = new Date();

export let departments: Department[] = [
    {
        name: 'Engineering',
        positions: [
            { 
                id: 'eng-mech', 
                name: 'Mechanical Engineer', 
                medicalExamFrequency: 5, 
                fireProtectionExamFrequency: 3, 
                description: 'Designs mechanical systems.', 
                risksAndMeasures: [], 
                riskLevel: 'Low', 
                specialConditions: '' 
            },
            { 
                id: 'eng-elec', 
                name: 'Electrical Engineer', 
                medicalExamFrequency: 5, 
                fireProtectionExamFrequency: 3, 
                description: 'Designs electrical systems.', 
                risksAndMeasures: [], 
                riskLevel: 'Low', 
                specialConditions: '' 
            },
            { 
                id: 'eng-robot', 
                name: 'Robotics Engineer', 
                medicalExamFrequency: 5, 
                fireProtectionExamFrequency: 3,                 description: 'Designs and develops robotic systems.', 
                risksAndMeasures: [], 
                riskLevel: 'Low', 
                specialConditions: '' 
            }
        ]
    },
    {
        name: 'EHS',
        positions: [
            { 
                id: 'safe-man', 
                name: 'EHS Manager', 
                medicalExamFrequency: 5, 
                fireProtectionExamFrequency: 1, 
                description: 'Manages environmental, health, and safety programs.', 
                risksAndMeasures: [], 
                riskLevel: 'Low', 
                specialConditions: '',
                subPositions: [
                    { 
                        id: 'safe-coord', 
                        name: 'Safety Coordinator', 
                        medicalExamFrequency: 5, 
                        fireProtectionExamFrequency: 1, 
                        description: 'Coordinates safety programs.', 
                        risksAndMeasures: [], 
                        riskLevel: 'Low', 
                        specialConditions: '' 
                    }
                ] 
            }
        ]
    },
    {
        name: 'Human Resources',
        positions: [
            { 
                id: 'hr-bp', 
                name: 'HR Business Partner', 
                medicalExamFrequency: 0, 
                fireProtectionExamFrequency: 5, 
                description: 'Provides HR partnership.', 
                risksAndMeasures: [], 
                riskLevel: 'Low', 
                specialConditions: 'N/A',
                subPositions: [
                    { 
                        id: 'hr-gen', 
                        name: 'HR Generalist', 
                        medicalExamFrequency: 0, 
                        fireProtectionExamFrequency: 5, 
                        description: 'Handles general HR tasks.', 
                        risksAndMeasures: [], 
                        riskLevel: 'Low', 
                        specialConditions: 'N/A' 
                    },
                    { 
                        id: 'hr-rec', 
                        name: 'Recruiter', 
                        medicalExamFrequency: 0, 
                        fireProtectionExamFrequency: 5, 
                        description: 'Recruits new employees.', 
                        risksAndMeasures: [], 
                        riskLevel: 'Low', 
                        specialConditions: 'N/A' 
                    }
                ]
            }
        ]
    },
    {
        name: 'Maintenance',
        positions: [
            {
                id: 'maint-sup',
                name: 'Maintenance Supervisor',
                description: 'Supervises maintenance staff.',
                medicalExamFrequency: 3,
                fireProtectionExamFrequency: 1,
                riskLevel: 'Medium',
                risksAndMeasures: [],
                specialConditions: '',
                subPositions: [
                    {
                        id: 'maint-tech',
                        name: 'Maintenance Technician',
                        description: 'Repairs and maintains machinery and mechanical equipment.',
                        medicalExamFrequency: 2,
                        fireProtectionExamFrequency: 1,
                        riskLevel: 'High',
                        risksAndMeasures: [{ id: 'rm12', risk: 'Electrical shock', measure: 'Lockout/Tagout procedures' }],
                        specialConditions: ''
                    },
                    {
                        id: 'prod-weld',
                        name: 'Welder',
                        description: 'Uses hand-welding or flame-cutting equipment to weld or join metal components.',
                        medicalExamFrequency: 1.5,
                        fireProtectionExamFrequency: 1,
                        riskLevel: 'High',
                        risksAndMeasures: [
                            { id: 'rm7', risk: 'UV radiation exposure', measure: 'Use of welding helmets and protective clothing' },
                            { id: 'rm8', risk: 'Inhalation of metal fumes', measure: 'Use of fume extractors' }
                        ],
                        specialConditions: 'Requires vision test every 2 years.'
                    }
                ]
            }
        ]
    },
    {
        name: 'Production',
        positions: [
            {
                id: 'prod-sup',
                name: 'Production Supervisor',
                description: 'Supervises and coordinates the activities of production and operating workers.',
                medicalExamFrequency: 2,
                fireProtectionExamFrequency: 1,
                riskLevel: 'Medium',
                risksAndMeasures: [
                    { id: 'rm1', risk: 'High noise levels', measure: 'Use of ear protection' },
                    { id: 'rm2', risk: 'Repetitive strain injury', measure: 'Regular breaks and ergonomic training' }
                ],
                specialConditions: 'Must be forklift certified.',
                subPositions: [
                    {
                        id: 'prod-asm',
                        name: 'Assembly Line Worker',
                        description: 'Assembles parts or units, and positions, aligns, and fastens units to assemblies, subassemblies, or frames.',
                        medicalExamFrequency: 3,
                        fireProtectionExamFrequency: 2,
                        riskLevel: 'Medium',
                        risksAndMeasures: [
                            { id: 'rm3', risk: 'Repetitive motion', measure: 'Job rotation' },
                            { id: 'rm4', risk: 'Sharp objects', measure: 'Use of protective gloves' }
                        ],
                        specialConditions: ''
                    },
                    {
                        id: 'prod-paint',
                        name: 'Paint Shop Operator',
                        description: 'Operates or tends machines to coat or paint any of a wide variety of products.',
                        medicalExamFrequency: 1,
                        fireProtectionExamFrequency: 1,
                        riskLevel: 'High',
                        risksAndMeasures: [
                            { id: 'rm5', risk: 'Inhalation of fumes', measure: 'Use of respirators and proper ventilation' },
                            { id: 'rm6', risk: 'Skin contact with chemicals', measure: 'Use of chemical-resistant gloves and suits' }
                        ],
                        specialConditions: 'Requires annual respiratory fit test.'
                    },
                ]
            }
        ]
    },
    {
        name: 'Quality Assurance',
        positions: [
            { 
                id: 'qa-man', 
                name: 'QA Manager',
                medicalExamFrequency: 5,
                fireProtectionExamFrequency: 1,
                description: 'Oversees the quality assurance department and ensures that products meet standards.',
                risksAndMeasures: [
                    { id: 'rm9', risk: 'Stress from deadlines', measure: 'Time management training' }
                ],
                riskLevel: 'Low',
                specialConditions: '',
                subPositions: [
                    {
                        id: 'qa-eng', 
                        name: 'Quality Engineer',
                        medicalExamFrequency: 5,
                        fireProtectionExamFrequency: 2,
                        description: 'Monitors and tests the quality of products and processes.',
                        risksAndMeasures: [
                            { id: 'rm10', risk: 'Eye strain from inspection', measure: 'Adequate lighting and regular breaks' }
                        ],
                        riskLevel: 'Low',
                        specialConditions: ''
                    },
                    {
                        id: 'qa-insp', 
                        name: 'Quality Control Inspector',
                        medicalExamFrequency: 4,
                        fireProtectionExamFrequency: 2,
                        description: 'Inspects materials and products for defects and to ensure conformance with specifications.',
                        risksAndMeasures: [
                            { id: 'rm11', risk: 'Eye strain from visual inspection', measure: 'Use of magnifying equipment' }
                        ],
                        riskLevel: 'Low',
                        specialConditions: ''
                    }
                ]
            }
        ]
    },
    {
        name: 'Supply Chain',
        positions: [
            { 
                id: 'sc-log', 
                name: 'Logistics Coordinator', 
                medicalExamFrequency: 5, 
                fireProtectionExamFrequency: 3, 
                description: 'Coordinates logistics.', 
                risksAndMeasures: [], 
                riskLevel: 'Low', 
                specialConditions: '',
                subPositions: [
                    { 
                        id: 'sc-ware', 
                        name: 'Warehouse Associate',
                        medicalExamFrequency: 4, 
                        fireProtectionExamFrequency: 2, 
                        description: 'Works in the warehouse.', 
                        risksAndMeasures: [{id: 'rm13', risk: 'Falling objects', measure: 'Hard hat usage'}], 
                        riskLevel: 'Medium', 
                        specialConditions: '' 
                    }
                ]
            }
        ]
    }
];

export let employees: Employee[] = [
  { id: '1', employeeId: 'E1001', firstName: 'John', lastName: 'Doe', gender: 'Male', dateOfBirth: '1985-05-15', socialSecurityNumber: '123-456-7890', residence: '123 Main St', municipality: 'Anytown', profession: 'Mechanic', employmentDate: '2015-03-01', position: 'Assembly Line Worker', department: 'Production', email: 'john.doe@example.com', certifications: ['Forklift Operation', 'Hazardous Materials Handling'], status: 'Active' },
  { id: '2', employeeId: 'E1002', firstName: 'Jane', lastName: 'Smith', gender: 'Female', dateOfBirth: '1990-08-22', socialSecurityNumber: '234-567-8901', residence: '456 Oak Ave', municipality: 'Otherville', profession: 'Engineer', employmentDate: '2018-07-15', position: 'Quality Control Inspector', department: 'Quality Assurance', email: 'jane.smith@example.com', certifications: ['ISO 9001 Auditing', 'Six Sigma Green Belt'], status: 'Active' },
  { id: '3', employeeId: 'E1003', firstName: 'Mike', lastName: 'Johnson', gender: 'Male', dateOfBirth: '1982-11-30', socialSecurityNumber: '345-678-9012', residence: '789 Pine Ln', municipality: 'Somewhere', profession: 'Electrician', employmentDate: '2012-01-10', position: 'Maintenance Technician', department: 'Maintenance', email: 'mike.johnson@example.com', certifications: ['Electrical Safety', 'Lockout/Tagout Procedures'], status: 'Active' },
  { id: '4', employeeId: 'E1004', firstName: 'Emily', lastName: 'Davis', gender: 'Female', dateOfBirth: '1988-02-20', socialSecurityNumber: '456-789-0123', residence: '101 Maple Dr', municipality: 'Anytown', profession: 'Safety Inspector', employmentDate: '2020-09-01', position: 'EHS Manager', department: 'EHS', email: 'emily.davis@example.com', certifications: ['OSHA 30-Hour', 'Certified Safety Professional'], status: 'Active' },
  { id: '5', employeeId: 'E1005', firstName: 'Chris', lastName: 'Brown', gender: 'Male', dateOfBirth: '1992-04-12', socialSecurityNumber: '567-890-1234', residence: '212 Birch Rd', municipality: 'Otherville', profession: 'Robotics Specialist', employmentDate: '2019-11-20', position: 'Robotics Engineer', department: 'Engineering', email: 'chris.brown@example.com', certifications: ['Robot Safety Standards', 'Advanced PLC Programming'], status: 'On Leave' },
  { id: '6', employeeId: 'E1006', firstName: 'Sarah', lastName: 'Wilson', gender: 'Female', dateOfBirth: '1995-09-05', socialSecurityNumber: '678-901-2345', residence: '333 Cedar Ct', municipality: 'Somewhere', profession: 'Painter', employmentDate: '2021-02-18', position: 'Paint Shop Operator', department: 'Production', email: 'sarah.wilson@example.com', certifications: ['Respirator Fit Testing', 'Chemical Safety'], status: 'Active' },
  { id: '7', employeeId: 'E1007', firstName: 'David', lastName: 'Lee', gender: 'Male', dateOfBirth: '1989-12-10', socialSecurityNumber: '789-012-3456', residence: '444 Willow Way', municipality: 'Anytown', profession: 'Logistics Expert', employmentDate: '2017-05-25', terminationDate: '2023-10-31', position: 'Logistics Coordinator', department: 'Supply Chain', email: 'david.lee@example.com', certifications: ['Forklift Operation'], status: 'Terminated' },
  { id: '8', employeeId: 'E1008', firstName: 'Jessica', lastName: 'Miller', gender: 'Female', dateOfBirth: '1993-07-18', socialSecurityNumber: '890-123-4567', residence: '555 Spruce St', municipality: 'Otherville', profession: 'HR Generalist', employmentDate: '2022-08-01', position: 'HR Business Partner', department: 'Human Resources', email: 'jessica.miller@example.com', certifications: [], status: 'Active' },
];

export let trainingModules: TrainingModule[] = [
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

export let safetyIncidents: SafetyIncident[] = [
  { id: 's1', employeeId: '1', date: format(subDays(today, 40), 'yyyy-MM-dd'), description: 'Minor slip on wet floor, no injury.', type: 'Near Miss' },
  { id: 's2', employeeId: '6', date: format(subDays(today, 90), 'yyyy-MM-dd'), description: 'Incorrect chemical mixture led to paint batch disposal.', type: 'Property Damage' },
  { id: 's3', employeeId: '3', date: format(subDays(today, 120), 'yyyy-MM-dd'), description: 'Minor cut on hand from exposed wiring.', type: 'Injury' },
];

export let ppeEquipment: PPEEquipment[] = [
  { id: 'ppe-equip-1', name: 'T-shirt', renewalMonths: 3, stock: 100 },
  { id: 'ppe-equip-2', name: 'Trousers', renewalMonths: 6, stock: 80 },
  { id: 'ppe-equip-3', name: 'Safety Boots', renewalMonths: 24, stock: 50 },
  { id: 'ppe-equip-4', name: 'Jacket', renewalMonths: 60, stock: 40 },
  { id: 'ppe-equip-5', name: 'Jersey', renewalMonths: 12, stock: 60 },
  { id: 'ppe-equip-6', name: 'Winter Jacket', renewalMonths: 60, stock: 30 },
  { id: 'ppe-equip-7', name: 'Winter Shoes', renewalMonths: 24, stock: 30 },
  { id: 'ppe-equip-8', name: 'Locker Keys', renewalMonths: 0, stock: 200 }, // 0 = no renewal
  { id: 'ppe-equip-9', name: 'Office Shirt', renewalMonths: 12, stock: 50 },
  { id: 'ppe-equip-10', name: 'Long-sleeve Shirt', renewalMonths: 6, stock: 70 },
  { id: 'ppe-equip-11', name: 'Mask Filters', renewalMonths: 1, stock: 300 },
  { id: 'ppe-equip-12', name: 'Mask', renewalMonths: 12, stock: 50 },
  { id: 'ppe-equip-13', name: 'Protective Glasses', renewalMonths: 24, stock: 100 },
];

export let ppeCheckouts: PPECheckout[] = [
  { id: 'ppe-chk-1', employeeId: '1', equipmentId: 'ppe-equip-3', checkoutDate: format(subMonths(today, 25), 'yyyy-MM-dd'), size: '10', isPremature: false },
  { id: 'ppe-chk-2', employeeId: '2', equipmentId: 'ppe-equip-4', checkoutDate: format(subMonths(today, 50), 'yyyy-MM-dd'), size: 'M', isPremature: false },
  { id: 'ppe-chk-3', employeeId: '6', equipmentId: 'ppe-equip-12', checkoutDate: format(subMonths(today, 11), 'yyyy-MM-dd'), isPremature: false },
  { id: 'ppe-chk-4', employeeId: '1', equipmentId: 'ppe-equip-1', checkoutDate: format(subMonths(today, 1), 'yyyy-MM-dd'), size: 'L', isPremature: false },
  { id: 'ppe-chk-5', employeeId: '3', equipmentId: 'ppe-equip-2', checkoutDate: format(subMonths(today, 7), 'yyyy-MM-dd'), size: '34', isPremature: true, notes: 'Original pair torn on machinery.' },
];

export let ppeInboundDeliveries: PPEInboundDelivery[] = [
    { id: 'del-1', equipmentId: 'ppe-equip-1', quantity: 50, deliveryDate: format(subDays(today, 10), 'yyyy-MM-dd'), notes: 'From Supplier A' },
    { id: 'del-2', equipmentId: 'ppe-equip-3', quantity: 20, deliveryDate: format(subDays(today, 5), 'yyyy-MM-dd') },
    { id: 'del-3', equipmentId: 'ppe-equip-11', quantity: 200, deliveryDate: format(subDays(today, 2), 'yyyy-MM-dd'), notes: 'From Supplier B' },
];

// --- GETTERS ---
export function getEmployees() { return employees; }
export function getEmployee(id: string) { return employees.find(e => e.id === id); }
export function getTrainingsForEmployee(employeeId: string) { return trainingModules.filter(t => t.employeeId === employeeId); }
export function getIncidentsForEmployee(employeeId:string) { return safetyIncidents.filter(i => i.employeeId === employeeId); }
export function getPpeCheckouts() { return ppeCheckouts; }
export function getPpeEquipment() { return ppeEquipment; }
export function getPpeInboundDeliveries() { return ppeInboundDeliveries; }
export function getPpeStock() {
    const stock: Record<string, number> = {};
    ppeEquipment.forEach(eq => {
        stock[eq.id] = eq.stock;
    });
    return stock;
}


// --- MUTATIONS ---
export function addEmployee(employeeData: Omit<Employee, 'id' | 'certifications' | 'terminationDate'>) {
    if (employees.some(e => e.employeeId === employeeData.employeeId)) {
        return { success: false, error: 'Employee ID must be unique.' };
    }
    const newEmployee: Employee = {
        ...employeeData,
        id: `emp-${Date.now()}`,
        certifications: [],
    };
    employees = [newEmployee, ...employees];
    return { success: true, employee: newEmployee };
}


export function updateEmployee(updatedEmployee: Employee) {
    const index = employees.findIndex(e => e.id === updatedEmployee.id);
    if (index === -1) { return { success: false, error: "Employee not found." }; }
    employees[index] = updatedEmployee;
    return { success: true };
}

export function addPpeCheckout(checkout: Omit<PPECheckout, 'id'>) {
    const equipment = ppeEquipment.find(e => e.id === checkout.equipmentId);
    if (!equipment) {
        return { success: false, error: "Equipment not found." };
    }
    if (equipment.stock < 1) {
        return { success: false, error: "Not enough stock to complete checkout." };
    }
    
    equipment.stock -= 1;
    const newCheckout: PPECheckout = { id: `ppe-chk-${Date.now()}`, ...checkout, };
    ppeCheckouts = [newCheckout, ...ppeCheckouts];
    return { success: true, checkout: newCheckout };
}

export function updatePpeCheckout(updatedCheckout: PPECheckout) {
    const index = ppeCheckouts.findIndex(c => c.id === updatedCheckout.id);
    if (index === -1) { return { success: false, error: "Checkout record not found." }; }
    ppeCheckouts[index] = updatedCheckout;
    return { success: true };
}

export function addPpeEquipment(equipmentData: Omit<PPEEquipment, 'id' | 'stock'>) {
    const trimmedName = equipmentData.name.trim();
    if (trimmedName === '') { return { success: false, error: 'Equipment name cannot be empty.' }; }
    if (ppeEquipment.some(item => item.name.toLowerCase() === trimmedName.toLowerCase())) {
        return { success: false, error: `Equipment "${trimmedName}" already exists.` };
    }
    const newEquipment: PPEEquipment = {
        id: `ppe-equip-${Date.now()}`,
        name: trimmedName,
        renewalMonths: equipmentData.renewalMonths,
        stock: 0,
    };
    ppeEquipment = [...ppeEquipment, newEquipment].sort((a,b) => a.name.localeCompare(b.name));
    return { success: true };
}

export function editPpeEquipment(equipmentId: string, equipmentData: Partial<Omit<PPEEquipment, 'id' | 'stock'>>) {
    const index = ppeEquipment.findIndex(item => item.id === equipmentId);
    if (index === -1) { return { success: false, error: `Equipment not found.` }; }

    if (equipmentData.name) {
        const trimmedNewName = equipmentData.name.trim();
        if (trimmedNewName === '') { return { success: false, error: 'Equipment name cannot be empty.' }; }
        if (ppeEquipment.some(item => item.name.toLowerCase() === trimmedNewName.toLowerCase() && item.id !== equipmentId)) {
            return { success: false, error: `Equipment name "${trimmedNewName}" already exists.` };
        }
        ppeEquipment[index].name = trimmedNewName;
    }
    if (equipmentData.renewalMonths !== undefined) {
        ppeEquipment[index].renewalMonths = equipmentData.renewalMonths;
    }

    ppeEquipment.sort((a,b) => a.name.localeCompare(b.name));
    return { success: true };
}

export function removePpeEquipment(equipmentId: string) {
    const equipment = ppeEquipment.find(eq => eq.id === equipmentId);
    if (!equipment) { return { success: false, error: `Equipment not found.` }; }
    if (ppeCheckouts.some(checkout => checkout.equipmentId === equipmentId)) {
        return { success: false, error: `Cannot remove "${equipment.name}" as it has checkout records.`};
    }
    ppeEquipment = ppeEquipment.filter(item => item.id !== equipmentId);
    return { success: true };
}

export function addPpeInboundDelivery(delivery: Omit<PPEInboundDelivery, 'id' | 'deliveryDate'>) {
    const equipment = ppeEquipment.find(eq => eq.id === delivery.equipmentId);
    if (!equipment) {
        return { success: false, error: "Equipment not found." };
    }
    if (delivery.quantity <= 0) {
        return { success: false, error: "Quantity must be positive." };
    }

    equipment.stock += delivery.quantity;

    const newDelivery: PPEInboundDelivery = {
        id: `del-${Date.now()}`,
        deliveryDate: format(new Date(), "yyyy-MM-dd"),
        ...delivery,
    };
    ppeInboundDeliveries = [newDelivery, ...ppeInboundDeliveries];
    return { success: true, delivery: newDelivery };
}


// --- Department/Position Mutations ---

function findPositionInArray(positions: Position[], positionId: string): { position: Position | null, parentArray: Position[] | null, index: number } {
    for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        if (position.id === positionId) {
            return { position, parentArray: positions, index: i };
        }
        if (position.subPositions) {
            const found = findPositionInArray(position.subPositions, positionId);
            if (found.position) {
                return found;
            }
        }
    }
    return { position: null, parentArray: null, index: -1 };
}

function findPositionAndParent(departmentName: string, positionId: string): { position: Position | null, parentArray: Position[] | null, index: number } {
    const department = departments.find(d => d.name === departmentName);
    if (!department) return { position: null, parentArray: null, index: -1 };
    return findPositionInArray(department.positions, positionId);
}

function isNameDuplicate(positions: Position[], newName: string, excludedId?: string): boolean {
    return positions.some(p => p.name.toLowerCase() === newName.toLowerCase() && p.id !== excludedId);
}

export function addDepartment(departmentName: string) {
    const trimmedName = departmentName.trim();
    if (trimmedName === '') {
        return { success: false, error: 'Department name cannot be empty.' };
    }
    if (departments.some(d => d.name.toLowerCase() === trimmedName.toLowerCase())) {
        return { success: false, error: `Department "${trimmedName}" already exists.` };
    }
    departments = [...departments, { name: trimmedName, positions: [] }].sort((a, b) => a.name.localeCompare(b.name));
    return { success: true };
}

export function editDepartment(oldName: string, newName: string) {
    const trimmedNewName = newName.trim();
    if (trimmedNewName === '') { return { success: false, error: 'Department name cannot be empty.' }; }
    const index = departments.findIndex(d => d.name.toLowerCase() === oldName.toLowerCase());
    if (index === -1) { return { success: false, error: `Department "${oldName}" not found.` }; }
    if (departments.some(d => d.name.toLowerCase() === trimmedNewName.toLowerCase() && d.name.toLowerCase() !== oldName.toLowerCase())) {
        return { success: false, error: `Department "${trimmedNewName}" already exists.` };
    }
    departments[index].name = trimmedNewName;
    departments.sort((a, b) => a.name.localeCompare(b.name));
    employees = employees.map(e => e.department === oldName ? { ...e, department: trimmedNewName } : e);
    return { success: true };
}

export function removeDepartment(departmentName: string) {
    if (employees.some(e => e.department === departmentName)) {
        return { success: false, error: `Cannot remove "${departmentName}" as it is assigned to one or more employees.`};
    }
    departments = departments.filter(d => d.name.toLowerCase() !== departmentName.toLowerCase());
    return { success: true };
}


export function addPosition(departmentName: string, positionData: Omit<Position, 'id' | 'subPositions'>, parentId?: string | null) {
    const department = departments.find(d => d.name === departmentName);
    if (!department) {
        return { success: false, error: `Department "${departmentName}" not found.` };
    }

    const newPosition: Position = {
        ...positionData,
        id: `pos-${Date.now()}-${Math.random()}`,
        risksAndMeasures: positionData.risksAndMeasures || [],
        subPositions: []
    };

    if (parentId) {
        const { position: parentPosition } = findPositionAndParent(departmentName, parentId);
        if (!parentPosition) {
            return { success: false, error: `Parent position with ID "${parentId}" not found.` };
        }
        if (isNameDuplicate(parentPosition.subPositions || [], newPosition.name)) {
            return { success: false, error: `A position with the name "${newPosition.name}" already exists here.` };
        }
        if (!parentPosition.subPositions) {
            parentPosition.subPositions = [];
        }
        parentPosition.subPositions.push(newPosition);
        parentPosition.subPositions.sort((a,b) => a.name.localeCompare(b.name));
    } else {
        if (isNameDuplicate(department.positions, newPosition.name)) {
            return { success: false, error: `A position with the name "${newPosition.name}" already exists in this department.` };
        }
        department.positions.push(newPosition);
        department.positions.sort((a,b) => a.name.localeCompare(b.name));
    }

    return { success: true, position: newPosition };
}

export function editPosition(departmentName: string, positionId: string, positionData: Partial<Omit<Position, 'id' | 'subPositions'>>) {
    const { position, parentArray } = findPositionAndParent(departmentName, positionId);

    if (!position || !parentArray) {
        return { success: false, error: `Position with ID "${positionId}" not found.` };
    }

    const oldName = position.name;
    
    if (positionData.name && positionData.name !== oldName) {
        if (isNameDuplicate(parentArray, positionData.name, positionId)) {
            return { success: false, error: `A position with the name "${positionData.name}" already exists at this level.` };
        }
    }
    
    Object.assign(position, positionData);

    if (positionData.name && positionData.name !== oldName) {
        employees = employees.map(e => (e.department === departmentName && e.position === oldName) ? { ...e, position: positionData.name! } : e);
    }
    
    parentArray.sort((a,b) => a.name.localeCompare(b.name));
    
    return { success: true, position };
}

export function removePosition(departmentName: string, positionId: string) {
    const { position: positionToRemove, parentArray } = findPositionAndParent(departmentName, positionId);
    
    if (!positionToRemove) {
        return { success: false, error: `Position with ID "${positionId}" not found.` };
    }

    if (employees.some(e => e.department === departmentName && e.position === positionToRemove.name)) {
        return { success: false, error: `Cannot remove "${positionToRemove.name}" as it is assigned to one or more employees.`};
    }
    
    if (positionToRemove.subPositions && positionToRemove.subPositions.length > 0) {
        return { success: false, error: `Cannot remove "${positionToRemove.name}" as it has sub-positions.`};
    }

    if (!parentArray) {
        return { success: false, error: "Could not find the position's container." };
    }

    const index = parentArray.findIndex(p => p.id === positionId);
    if (index > -1) {
        parentArray.splice(index, 1);
        return { success: true };
    }

    return { success: false, error: "Failed to remove the position." };
}

export function getAllPositions(departmentName: string): { id: string, name: string, level: number }[] {
    const department = departments.find(d => d.name === departmentName);
    if (!department) return [];
  
    const positionsList: { id: string, name: string, level: number }[] = [];
  
    function traverse(positions: Position[], level: number) {
      positions.forEach(pos => {
        positionsList.push({ id: pos.id, name: pos.name, level: level });
        if (pos.subPositions) {
          traverse(pos.subPositions, level + 1);
        }
      });
    }
  
    traverse(department.positions, 0);
    return positionsList;
  }

    
