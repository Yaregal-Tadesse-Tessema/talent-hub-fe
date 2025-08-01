import { api } from '@/config/api';

export interface ResumeFile {
  bucketName: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

export interface JobSeekerProfile {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female';
  gpa: string | null;
  yearOfExperience: number;
  highestLevelOfEducation: string;
  industry: string[];
  preferredJobLocation: string[];
  profileHeadLine: string;
  professionalSummery: string;
  coverLetter: string;
  salaryExpectations: number;
  aiGeneratedJobFitScore: number;
  linkedinUrl: string;
  portfolioUrl: string;
  telegramUserId: string;
  technicalSkills: string[];
  softSkills: string[];
  resume: ResumeFile;
  profile?: any;
  address?: Record<string, any>;
  educations?: any;
  experiences?: any;
  socialMediaLinks?: Record<string, string>;
  alertConfiguration?: any;
  isProfilePublic: boolean;
  isResumePublic: boolean;

  status: 'Active' | 'Inactive' | 'Pending' | string;
  tenantId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export const employeeService = {
  async getEmployers(): Promise<any> {
    try {
      const response = await api.get('/tenants');
      return response.data;
    } catch (error) {
      console.error('Error fetching employers:', error);
      throw error;
    }
  },

  async getCandidates(): Promise<{ items: JobSeekerProfile[] }> {
    try {
      const response = await api.get('/users/?q=w=status:=:Active');
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  async searchCandidates(
    searchQuery?: string,
    experience?: string,
    education?: string[],
    gender?: string,
    salaryRange?: string,
    jobFitScore?: string,
    industries?: string[],
    top?: number,
    skip?: number,
  ): Promise<{ items: JobSeekerProfile[]; total?: number }> {
    let queryParams = '';
    const conditions: string[] = [];
    let finalQueryParams = '';

    try {
      // Search query for name, skills, job title, etc.
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim().toLowerCase();

        // Try searching across multiple fields using parentheses grouping
        // This format: (field1:LIKE:term,field2:LIKE:term,field3:LIKE:term)
        const searchConditions = [
          `firstName:LIKE:${searchTerm}`,
          `lastName:LIKE:${searchTerm}`,
          `email:LIKE:${searchTerm}`,
        ];
        conditions.push(`(${searchConditions.join(',')})`);
      }

      // Experience filter - handle string to number conversion
      if (experience && experience !== 'All') {
        let experienceCondition = '';
        switch (experience) {
          case 'Freshers':
            experienceCondition = 'yearOfExperience:=:0';
            break;
          case '1 - 2 Years':
            experienceCondition = 'yearOfExperience:>=:1,yearOfExperience:<=:2';
            break;
          case '2 - 4 Years':
            experienceCondition = 'yearOfExperience:>=:2,yearOfExperience:<=:4';
            break;
          case '4 - 6 Years':
            experienceCondition = 'yearOfExperience:>=:4,yearOfExperience:<=:6';
            break;
          case '6 - 8 Years':
            experienceCondition = 'yearOfExperience:>=:6,yearOfExperience:<=:8';
            break;
          case '8 - 10 Years':
            experienceCondition =
              'yearOfExperience:>=:8,yearOfExperience:<=:10';
            break;
          case '10 - 15 Years':
            experienceCondition =
              'yearOfExperience:>=:10,yearOfExperience:<=:15';
            break;
          case '15+ Years':
            experienceCondition = 'yearOfExperience:>=:15';
            break;
        }
        if (experienceCondition) {
          conditions.push(experienceCondition);
        }
      }

      // Education filter - map to actual database values
      if (education && education.length > 0 && !education.includes('All')) {
        const educationMapping: { [key: string]: string } = {
          'High School': 'High School',
          Intermediate: 'Intermediate',
          Graduation: 'Graduation',
          'Master Degree': "Master's Degree",
          'Bachelor Degree': "Bachelor's Degree",
          Diploma: 'Diploma',
          PhD: 'PhD',
          'Associate Degree': 'Associate Degree',
          Certificate: 'Certificate',
        };

        education.forEach((edu) => {
          const mappedValue = educationMapping[edu] || edu;
          conditions.push(`highestLevelOfEducation:=:${mappedValue}`);
        });
      }

      // Gender filter - convert to lowercase to match the interface
      if (gender && gender !== 'All') {
        const genderValue = gender.toLowerCase();
        conditions.push(`gender:=:${genderValue}`);
      }

      // Salary range filter - handle string to number conversion
      if (salaryRange && salaryRange !== 'All') {
        let salaryCondition = '';
        switch (salaryRange) {
          case 'Under $30k':
            salaryCondition = 'salaryExpectations:<=:30000';
            break;
          case '$30k - $50k':
            salaryCondition =
              'salaryExpectations:>=:30000,salaryExpectations:<=:50000';
            break;
          case '$50k - $75k':
            salaryCondition =
              'salaryExpectations:>=:50000,salaryExpectations:<=:75000';
            break;
          case '$75k - $100k':
            salaryCondition =
              'salaryExpectations:>=:75000,salaryExpectations:<=:100000';
            break;
          case '$100k - $150k':
            salaryCondition =
              'salaryExpectations:>=:100000,salaryExpectations:<=:150000';
            break;
          case '$150k+':
            salaryCondition = 'salaryExpectations:>=:150000';
            break;
        }
        if (salaryCondition) {
          conditions.push(salaryCondition);
        }
      }

      // Job fit score filter - handle string to number conversion
      if (jobFitScore && jobFitScore !== 'All') {
        let scoreCondition = '';
        switch (jobFitScore) {
          case '90%+ Match':
            scoreCondition = 'aiGeneratedJobFitScore:>=:90';
            break;
          case '80-89% Match':
            scoreCondition =
              'aiGeneratedJobFitScore:>=:80,aiGeneratedJobFitScore:<=:89';
            break;
          case '70-79% Match':
            scoreCondition =
              'aiGeneratedJobFitScore:>=:70,aiGeneratedJobFitScore:<=:79';
            break;
          case '60-69% Match':
            scoreCondition =
              'aiGeneratedJobFitScore:>=:60,aiGeneratedJobFitScore:<=:69';
            break;
          case 'Below 60%':
            scoreCondition = 'aiGeneratedJobFitScore:<:60';
            break;
        }
        if (scoreCondition) {
          conditions.push(scoreCondition);
        }
      }

      // Industry filter - handle array field properly
      if (industries && industries.length > 0 && !industries.includes('All')) {
        // For array fields, we need to check if the array contains the value
        // This might need to be adjusted based on your backend implementation
        const industryConditions = industries.map(
          (industry) => `industry:ILIKE:${industry}`,
        );
        conditions.push(`(${industryConditions.join(',')})`);
      }

      // Build query params
      if (conditions.length > 0) {
        queryParams = `q=w=${conditions.join('|')}`;
      }

      // Always add status filter
      const statusParam = 'status=Active';
      finalQueryParams =
        conditions.length > 0 ? `${queryParams}&${statusParam}` : statusParam;

      // Add pagination parameters
      if (top !== undefined) {
        finalQueryParams += `&t=${top}`;
      }
      if (skip !== undefined) {
        finalQueryParams += `&sk=${skip}`;
      }

      console.log('Search query params:', finalQueryParams);

      const response = await api.get(`/users/?${finalQueryParams}`);

      return response.data;
    } catch (error) {
      // If search fails, try to get all candidates as fallback
      if (searchQuery && searchQuery.trim()) {
        try {
          const fallbackResponse = await api.get('/users/?q=w=status:=:Active');
          return fallbackResponse.data;
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          throw error; // Throw the original error
        }
      }

      throw error;
    }
  },
};
