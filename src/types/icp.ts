// ICP Canister Types - matching Motoko definitions
export type PatientID = string;
export type TrialID = string;
export type Symptom = string;
export type Location = string;

export type AgeGroup = 'child' | 'adult' | 'senior';
export type Gender = 'male' | 'female' | 'nonbinary' | 'unspecified';

export interface PatientProfile {
  id: PatientID;
  symptoms: Symptom[];
  location: Location;
  ageGroup: AgeGroup;
  gender: Gender;
  encryptedData: string;
  dataHash: string;
  timestamp: number;
}

export interface ClinicalTrial {
  id: TrialID;
  title: string;
  description: string;
  requiredSymptoms: Symptom[];
  locations: Location[];
  ageRange: { min: number; max: number };
  genderEligibility: Gender[];
  recruitmentStatus: 'active' | 'paused' | 'completed';
}

export interface MatchResult {
  trialId: TrialID;
  matchScore: number;
  eligibilityProof: string;
}

export interface ICPCanisterActor {
  addPatient: (
    symptoms: Symptom[],
    location: Location,
    ageGroup: AgeGroup,
    gender: Gender,
    sensitiveData: string
  ) => Promise<PatientID>;
  
  addTrial: (trial: ClinicalTrial) => Promise<TrialID>;
  
  matchTrials: (patientId: PatientID) => Promise<MatchResult[]>;
  
  getAllTrials: () => Promise<ClinicalTrial[]>;
  
  getPatient: (patientId: PatientID) => Promise<PatientProfile | null>;
  
  agentCallback: (
    patientId: PatientID,
    trialId: TrialID,
    action: { consentRequested: null } | { matchNotification: null }
  ) => Promise<void>;
  
  deletePatientData: (patientId: PatientID) => Promise<void>;
  
  getAuditLog: () => Promise<string[]>;
}