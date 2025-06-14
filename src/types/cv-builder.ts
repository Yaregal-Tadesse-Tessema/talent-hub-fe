export interface Profile {
  fullName: string;
  title: string;
  slogan?: string;
  email: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certificates: Certificate[];
  publications: Publication[];
  projects: Project[];
  awards: Award[];
  interests: string[];
  volunteer: VolunteerWork[];
  references: Reference[];
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
}

export interface Certificate {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Publication {
  id?: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  url?: string;
  technologies?: string[];
}

export interface Award {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface VolunteerWork {
  id?: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Reference {
  id?: string;
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
  relationship?: string;
}
