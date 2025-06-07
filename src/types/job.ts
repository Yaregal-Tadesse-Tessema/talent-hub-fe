export interface FileData {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
  bucketName: string;
}

export interface User {
  id: string;
  phone: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  status: string;
  birthDate: string;
  linkedinUrl: string;
  portfolioUrl: string;
  yearOfExperience: number;
  telegramUserId: string;
  industry: string[];
  preferredJobLocation: string[];
  highestLevelOfEducation: string;
  salaryExpectations: number;
  aiGeneratedJobFitScore: number;
  profile: Record<string, any>;
  resume: Record<string, any>;
  technicalSkills: string[];
  softSkills: string[];
  socialMediaLinks: Record<string, any>;
  profileHeadLine: string;
  coverLetter: string;
  professionalSummery: string;
  educations: Record<string, any>;
  experiences: Record<string, any>;
}

export interface ReferralInformation {
  fullName: string;
  employeeId: string;
  id: string;
}

export interface Application {
  id: string;
  userId: string;
  JobPostId: string;
  cv: FileData;
  coverLetter: string;
  applicationInformation: Record<string, any>;
  userInfo: Record<string, any>;
  user: User;
  remark: string;
  status: string;
  notification: string;
  questionaryScore: number;
  isViewed: boolean;
  referralInformation: ReferralInformation;
  referenceReason: string;
  jobPost: string[];
}

export interface Job {
  id: string;
  jobPostId?: string;
  title: string;
  description: string;
  position: string;
  industry: string;
  type: string;
  city: string;
  location: string;
  employmentType: string;
  salaryRange: Record<string, any>;
  organizationId: string;
  deadline: string;
  requirementId: string;
  skill: string[];
  benefits: string[];
  responsibilities: string[];
  status: string;
  gender: string;
  minimumGPA: number;
  companyName: string;
  companyLogo: FileData;
  postedDate: string;
  applicationURL: string;
  experienceLevel: string;
  fieldOfStudy: string;
  educationLevel: string;
  howToApply: string;
  onHoldDate: string;
  applicationCount: number;
  jobPostRequirement: string[];
  applications: Application[];
  savedUsers: Application[];
  preScreeningQuestions: Application[];
  isSaved: boolean;
  isApplied: boolean;
  positionNumbers: number;
  paymentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  total: number;
  items: Job[];
}
