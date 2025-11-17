export type Employee = {
  id: string;
  name: string;
  email: string;
  jobRole: string;
  department: string;
  avatar: string;
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
