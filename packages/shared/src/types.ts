// VNEXIS v4.0 공유 타입 정의
// 백엔드 Pydantic 스키마와 1:1 매칭

export interface PatientSummary {
  Age: number;
  Gender: string;
  Subscription_Date: string;
  KCD_Version: string;
}

export interface MedicalOpinion {
  Raw_Diagnosis: string;
  Clinical_Finding: string;
  Pathology_Detail: string;
  Expert_Assessment: string;
  Confidence: number;
}

export interface CodingStandard {
  KCD_Code: string;
  KCD_Name: string;
  ICD_Code: string;
  ICD_Name: string;
  WHO_Classification: string;
}

export interface InsuranceCoverage {
  Coverage_Type: string;
  Policy_Definition: string;
  Meets_Definition: boolean;
  Gap_Analysis: string;
}

export interface FinalGrade {
  Determination: string;
  Probability: number;
}

export interface LegalBasis {
  Type: string;
  Case_ID: string;
  Court_Date: string;
  Key_Holding: string;
  Relevance: string;
  Source_Page: number;
}

export interface TimelineEntry {
  Date: string;
  Department?: string;
  Summary?: string;
  Event_Type?: string;
  Event?: string;
}

export interface CTALogic {
  Recommended_Action: string;
  Expected_Gain: string;
}

export interface AnonymousCaseData {
  Gender: string;
  Age_Group: string;
  Disease_Category: string;
  KCD_Code: string;
  ICD_Code: string;
  Coverage_Type: string;
  Determination: string;
  Probability: number;
  Key_Medical_Keywords: string[];
}

export interface VNEXISResponse {
  Analysis_ID: string;
  Timestamp: string;
  Patient_Summary: PatientSummary;
  Medical_Opinion: MedicalOpinion;
  Coding_Standard: CodingStandard;
  Insurance_Coverage: InsuranceCoverage;
  Final_Grade: FinalGrade;
  Legal_Basis: LegalBasis[];
  Medical_Timeline: TimelineEntry[];
  CTA_Logic: CTALogic;
  Anonymous_Case_Data: AnonymousCaseData;
}

// 테넌트 타입
export type TenantType = 'ga' | 'surveyor' | 'fc' | 'admin';
export type PlanType = 'basic' | 'pro' | 'enterprise';
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
