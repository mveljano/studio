

export type Employee = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  socialSecurityNumber: string;
  residence: string;
  municipality: string;
  profession: string;
  employmentDate: string;
  terminationDate?: string;
  position: string;
  department: string;
  email: string;
  certifications: string[];
  status: 'Active' | 'On Leave' | 'Terminated';
};

export type TrainingModule = {
  id: string;
  employeeId: string;
  name: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Overdue' | 'Not Started';
  completionDate?: string;
  score?: number;
};

export type SafetyIncident = {
  id: string;
  employeeId: string;
  date: string;
  description: string;
  type: 'Injury' | 'Near Miss' | 'Property Damage';
};

export type TrainingStatus = 'Completed' | 'In Progress' | 'Overdue' | 'Not Started';

export type PPEEquipment = {
  id: string;
  name: string;
  renewalMonths: number;
  stock: number;
};

export type PPECheckout = {
  id: string;
  employeeId: string;
  equipmentId: string;
  checkoutDate: string;
  size?: string;
  notes?: string;
  isPremature: boolean;
};

export type PPEInboundDelivery = {
  id: string;
  equipmentId: string;
  quantity: number;
  deliveryDate: string;
  notes?: string;
};

export type RiskAndMeasure = {
    id: string;
    risk: string;
    measure: string;
};

export type Position = {
    id: string;
    name: string;
    description: string;
    medicalExamFrequency: number;
    fireProtectionExamFrequency: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    specialConditions: string;
    risksAndMeasures: RiskAndMeasure[];
    subPositions?: Position[];
};

export type Department = {
    name: string;
    positions: Position[];
};


