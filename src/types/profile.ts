export interface FileInfo {
  path: string;
  filename?: string;
  originalname?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  status: string;
  address: Record<string, any>;
  birthDate: string;
  linkedinUrl: string;
  portfolioUrl: string;
  yearOfExperience: number;
  industry: string[];
  telegramUserId: string;
  preferredJobLocation: string[];
  highestLevelOfEducation: string;
  salaryExpectations: number;
  aiGeneratedJobFitScore: number;
  technicalSkills: string[];
  softSkills: string[];
  profile: FileInfo;
  resume: FileInfo;
  educations: Record<string, any>;
  experiences: Record<string, any>;
  socialMediaLinks: Record<string, any>;
  profileHeadLine: string;
  coverLetter: string;
  professionalSummery: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
}
