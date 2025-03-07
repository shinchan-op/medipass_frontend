export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  bloodGroup: string;
  medicalHistory?: MedicalHistory;
}

export interface MedicalHistory {
  allergies: string[];
  chronicConditions: string[];
  pastSurgeries: Surgery[];
  medications: Medication[];
}

export interface Surgery {
  id: string;
  name: string;
  date: string;
  hospital: string;
  doctor: string;
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  status: AppointmentStatus;
  purpose: string;
  notes?: string;
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENDING = "pending"
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: PrescribedMedication[];
  notes?: string;
}

export interface PrescribedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface TestResult {
  id: string;
  patientId: string;
  testName: string;
  category: string;
  date: string;
  result: string;
  normalRange?: string;
  notes?: string;
  reportUrl?: string;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  date: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  glucose?: number;
  weight?: number;
  height?: number;
}

export interface HealthMetric {
  date: string;
  value: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  contact: string;
  email: string;
}

export interface Insurance {
  id: string;
  patientId: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  validFrom: string;
  validUntil: string;
  contactInfo: string;
}

export interface Bill {
  id: string;
  patientId: string;
  date: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  dueDate?: string;
}

export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  OVERDUE = "overdue",
  CANCELLED = "cancelled"
} 