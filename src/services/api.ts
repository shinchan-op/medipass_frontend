import { 
  Patient, 
  Appointment, 
  Prescription, 
  TestResult, 
  VitalSigns, 
  Insurance, 
  Bill, 
  AppointmentStatus,
  PaymentStatus,
  HealthMetric
} from '../types';

// Mock patient data
const mockPatient: Patient = {
  id: "P12345",
  name: "John Doe",
  age: 42,
  gender: "Male",
  contact: "+1 (555) 123-4567",
  email: "john.doe@example.com",
  address: "123 Health Street, Medical City, MC 12345",
  bloodGroup: "O+",
  medicalHistory: {
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    pastSurgeries: [
      {
        id: "S001",
        name: "Appendectomy",
        date: "2018-05-12",
        hospital: "City General Hospital",
        doctor: "Dr. Sarah Johnson",
        notes: "Routine procedure, no complications"
      }
    ],
    medications: [
      {
        id: "M001",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2020-03-15",
        prescribedBy: "Dr. Robert Smith"
      },
      {
        id: "M002",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2020-03-15",
        prescribedBy: "Dr. Robert Smith"
      }
    ]
  }
};

// Mock appointments
const mockAppointments: Appointment[] = [
  {
    id: "A001",
    patientId: "P12345",
    doctorId: "D001",
    doctorName: "Dr. Robert Smith",
    specialty: "Cardiology",
    dateTime: "2023-03-15T10:30:00",
    status: AppointmentStatus.SCHEDULED,
    purpose: "Routine checkup"
  },
  {
    id: "A002",
    patientId: "P12345",
    doctorId: "D002",
    doctorName: "Dr. Emily Johnson",
    specialty: "Endocrinology",
    dateTime: "2023-03-20T14:00:00",
    status: AppointmentStatus.SCHEDULED,
    purpose: "Diabetes followup"
  },
  {
    id: "A003",
    patientId: "P12345",
    doctorId: "D001",
    doctorName: "Dr. Robert Smith",
    specialty: "Cardiology",
    dateTime: "2023-02-15T11:00:00",
    status: AppointmentStatus.COMPLETED,
    purpose: "Blood pressure check",
    notes: "Patient's blood pressure is now under control with medication."
  }
];

// Mock prescriptions
const mockPrescriptions: Prescription[] = [
  {
    id: "PR001",
    patientId: "P12345",
    doctorId: "D001",
    doctorName: "Dr. Robert Smith",
    date: "2023-02-15",
    medications: [
      {
        id: "PM001",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "3 months",
        instructions: "Take in the morning with food"
      }
    ]
  },
  {
    id: "PR002",
    patientId: "P12345",
    doctorId: "D002",
    doctorName: "Dr. Emily Johnson",
    date: "2023-02-20",
    medications: [
      {
        id: "PM002",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "3 months",
        instructions: "Take with meals"
      }
    ],
    notes: "Monitor blood glucose levels regularly"
  }
];

// Mock test results
const mockTestResults: TestResult[] = [
  {
    id: "TR001",
    patientId: "P12345",
    testName: "Complete Blood Count (CBC)",
    category: "Hematology",
    date: "2023-02-10",
    result: "Normal",
    normalRange: "4.5-5.5 million cells/mcL",
    notes: "All values within normal range"
  },
  {
    id: "TR002",
    patientId: "P12345",
    testName: "HbA1c",
    category: "Diabetes",
    date: "2023-02-10",
    result: "6.8%",
    normalRange: "Below 5.7%",
    notes: "Slightly elevated. Continue monitoring and medication"
  },
  {
    id: "TR003",
    patientId: "P12345",
    testName: "Lipid Panel",
    category: "Cardiovascular",
    date: "2023-02-10",
    result: "LDL: 130mg/dL, HDL: 45mg/dL, Triglycerides: 180mg/dL",
    normalRange: "LDL: <100mg/dL, HDL: >40mg/dL, Triglycerides: <150mg/dL",
    notes: "LDL and Triglycerides slightly elevated. Recommend dietary changes."
  }
];

// Mock vital signs data
const mockVitalSigns: VitalSigns[] = [
  {
    id: "VS001",
    patientId: "P12345",
    date: "2023-03-05",
    bloodPressure: "128/82",
    heartRate: 72,
    respiratoryRate: 16,
    temperature: 98.6,
    oxygenSaturation: 98,
    glucose: 110,
    weight: 180,
    height: 5.11
  },
  {
    id: "VS002",
    patientId: "P12345",
    date: "2023-02-15",
    bloodPressure: "135/88",
    heartRate: 75,
    respiratoryRate: 18,
    temperature: 98.4,
    oxygenSaturation: 97,
    glucose: 125,
    weight: 182,
    height: 5.11
  },
  {
    id: "VS003",
    patientId: "P12345",
    date: "2023-01-20",
    bloodPressure: "142/92",
    heartRate: 78,
    respiratoryRate: 18,
    temperature: 98.6,
    oxygenSaturation: 96,
    glucose: 130,
    weight: 185,
    height: 5.11
  }
];

// Mock insurance information
const mockInsurance: Insurance = {
  id: "INS001",
  patientId: "P12345",
  provider: "HealthGuard Insurance",
  policyNumber: "HG-123456789",
  coverage: "Comprehensive Health Plan",
  validFrom: "2023-01-01",
  validUntil: "2023-12-31",
  contactInfo: "+1 (555) 987-6543"
};

// Mock billing information
const mockBills: Bill[] = [
  {
    id: "B001",
    patientId: "P12345",
    date: "2023-02-15",
    description: "Cardiology Consultation",
    amount: 150,
    status: PaymentStatus.PAID
  },
  {
    id: "B002",
    patientId: "P12345",
    date: "2023-02-10",
    description: "Laboratory Tests - CBC, HbA1c, Lipid Panel",
    amount: 320,
    status: PaymentStatus.PAID
  },
  {
    id: "B003",
    patientId: "P12345",
    date: "2023-03-20",
    description: "Endocrinology Consultation",
    amount: 175,
    status: PaymentStatus.PENDING,
    dueDate: "2023-04-20"
  }
];

// Mock health metric data for charts
const generateRandomHealthData = (count: number, min: number, max: number, startDate: Date): HealthMetric[] => {
  const data: HealthMetric[] = [];
  const startTime = startDate.getTime();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startTime - i * 24 * 60 * 60 * 1000);
    const value = min + Math.random() * (max - min);
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(1))
    });
  }
  
  return data;
};

const today = new Date();
const mockBloodPressureData = generateRandomHealthData(30, 115, 145, today).map(item => ({
  ...item,
  systolic: item.value,
  diastolic: item.value - 40 - Math.random() * 10
}));

const mockGlucoseData = generateRandomHealthData(30, 80, 160, today);
const mockHeartRateData = generateRandomHealthData(30, 60, 90, today);
const mockWeightData = generateRandomHealthData(12, 175, 190, today);

// API service functions
export const fetchPatientProfile = (): Promise<Patient> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPatient), 500);
  });
};

export const fetchAppointments = (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAppointments), 500);
  });
};

export const fetchPrescriptions = (): Promise<Prescription[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPrescriptions), 500);
  });
};

export const fetchTestResults = (): Promise<TestResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTestResults), 500);
  });
};

export const fetchVitalSigns = (): Promise<VitalSigns[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVitalSigns), 500);
  });
};

export const fetchInsurance = (): Promise<Insurance> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockInsurance), 500);
  });
};

export const fetchBills = (): Promise<Bill[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBills), 500);
  });
};

export const fetchBloodPressureData = (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBloodPressureData), 500);
  });
};

export const fetchGlucoseData = (): Promise<HealthMetric[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockGlucoseData), 500);
  });
};

export const fetchHeartRateData = (): Promise<HealthMetric[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockHeartRateData), 500);
  });
};

export const fetchWeightData = (): Promise<HealthMetric[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockWeightData), 500);
  });
}; 