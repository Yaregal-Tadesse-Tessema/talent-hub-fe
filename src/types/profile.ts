export interface FileInfo {
  path: string;
  filename?: string;
  originalname?: string;
  updatedAt?: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: number;
  courses?: string[];
  description?: string;
}

export interface Experience {
  id?: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  technologies?: string[];
}

export interface UserProfile {
  id: string;
  phone: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  status?: string;
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
  educations: Education[];
  experiences: Experience[];
  socialMediaLinks: Record<string, any>;
  profileHeadLine: string;
  coverLetter: string;
  professionalSummery: string;
  notificationSetting?: string[];
  alertConfiguration?: string[];
  smsAlertConfiguration?: string[];
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  isProfilePublic: boolean;
  isResumePublic: boolean;
}
