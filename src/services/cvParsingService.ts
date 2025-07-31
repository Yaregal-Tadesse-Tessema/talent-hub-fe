/* eslint-disable no-useless-escape */
import { CohereClient } from 'cohere-ai';
import { UserProfile } from '@/types/profile';
import { api } from '@/config/api';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Briefcase, Trash2, GripVertical } from 'lucide-react';

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY || '',
});

// Helper function to fix malformed JSON
function fixMalformedJSON(jsonText: string): string {
  // Remove any trailing commas before closing braces/brackets
  let fixed = jsonText.replace(/,(\s*[}\]])/g, '$1');

  // Fix common JSON issues
  fixed = fixed.replace(/,\s*}/g, '}');
  fixed = fixed.replace(/,\s*]/g, ']');

  // Fix unquoted property names
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  // Fix single quotes to double quotes
  fixed = fixed.replace(/'/g, '"');

  return fixed;
}

// Helper function to create fallback data structure
function createFallbackDataStructure(text: string): any {
  // Extract basic information using regex patterns
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  );
  const phoneMatch = text.match(
    /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  );

  return {
    firstName: '',
    middleName: '',
    lastName: '',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    gender: '',
    birthDate: '',
    address: { street: '', city: '', state: '', postalCode: '', country: '' },
    linkedinUrl: '',
    portfolioUrl: '',
    yearOfExperience: 0,
    industry: [],
    telegramUserId: '',
    preferredJobLocation: [],
    highestLevelOfEducation: '',
    salaryExpectations: 0,
    technicalSkills: [],
    softSkills: [],
    profileHeadLine: '',
    coverLetter: '',
    professionalSummery: '',
    educations: {},
    experiences: {},
    socialMediaLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
  };
}

export interface ParsedCVData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  linkedinUrl: string;
  portfolioUrl: string;
  yearOfExperience: number;
  industry: string[];
  telegramUserId: string;
  preferredJobLocation: string[];
  highestLevelOfEducation: string;
  salaryExpectations: number;
  technicalSkills: string[];
  softSkills: string[];
  profileHeadLine: string;
  coverLetter: string;
  professionalSummery: string;
  educations: Record<string, any>;
  experiences: Record<string, any>;
  socialMediaLinks: Record<string, any>;
}

// New AI-powered mapping function
export async function mapExtractedDataToUserProfile(
  extractedData: any,
  userId: string,
): Promise<UserProfile> {
  try {
    // Convert the extracted data to a string for AI processing
    const extractedDataString = JSON.stringify(extractedData, null, 2);

    const prompt = `You are an AI assistant that maps extracted CV data to a UserProfile model. 

Extracted CV Data:
${extractedDataString}

Please map this data to the following UserProfile structure. Return only valid JSON:

{
  "id": "${userId}",
  "firstName": "",
  "middleName": "",
  "lastName": "",
  "email": "",
  "phone": "",
  "gender": "",
  "status": "Active",
  "address": {"street": "", "city": "", "state": "", "postalCode": "", "country": ""},
  "birthDate": "",
  "linkedinUrl": "",
  "portfolioUrl": "",
  "yearOfExperience": 0,
  "industry": [],
  "telegramUserId": "",
  "preferredJobLocation": [],
  "highestLevelOfEducation": "",
  "salaryExpectations": 0,
  "aiGeneratedJobFitScore": 0,
  "technicalSkills": [],
  "softSkills": [],
  "profile": {},
  "resume": {},
  "educations": [],
  "experiences": [],
  "socialMediaLinks": {},
  "profileHeadLine": "",
  "coverLetter": "",
  "professionalSummery": "",
  "notificationSetting": [],
  "alertConfiguration": [],
  "smsAlertConfiguration": [],
  "isProfilePublic": false,
  "isResumePublic": false,
  "isFirstTime": false
}

Mapping rules:
1. Extract full name and split into firstName, middleName, lastName
2. Map email, phone, gender, birthDate directly
3. Extract address information and map to address object
4. Map LinkedIn and portfolio URLs
5. Convert yearOfExperience to number
6. Extract industries and job locations as arrays
7. Map education level (e.g., "Bachelor's" -> "Bachelor")
8. Convert salary expectations to number
9. Extract technical and soft skills as arrays
10. Map profile headline and professional summary
11. Extract education and experience data as arrays of objects
12. Map social media links
13. Set default values for missing fields

Return only the JSON object:`;

    const response = await cohere.generate({
      prompt,
      maxTokens: 2000,
      temperature: 0.1,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE',
    });

    if (!response.generations || response.generations.length === 0) {
      throw new Error('No response generated from AI mapping');
    }

    const generatedText = response.generations[0].text.trim();

    // Clean up the response to extract just the JSON
    let jsonText = generatedText;

    // Remove any markdown formatting if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/```\n?/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/```\n?/, '');
    }

    // Try to find JSON object in the response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    // Parse the JSON response
    let mappedProfile;
    try {
      mappedProfile = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error in AI mapping:', parseError);

      // Try to fix malformed JSON
      const fixedJson = fixMalformedJSON(jsonText);
      try {
        mappedProfile = JSON.parse(fixedJson);
      } catch (secondError) {
        console.error('Failed to fix JSON in AI mapping:', secondError);
        throw new Error('Failed to parse AI mapping response');
      }
    }

    // Ensure all required fields are present with proper defaults
    const userProfile: UserProfile = {
      id: userId,
      firstName: mappedProfile.firstName || '',
      middleName: mappedProfile.middleName || '',
      lastName: mappedProfile.lastName || '',
      email: mappedProfile.email || '',
      phone: mappedProfile.phone || '',
      gender: mappedProfile.gender || '',
      status: mappedProfile.status || 'Active',
      address: mappedProfile.address || {},
      birthDate: mappedProfile.birthDate || '',
      linkedinUrl: mappedProfile.linkedinUrl || '',
      portfolioUrl: mappedProfile.portfolioUrl || '',
      yearOfExperience: mappedProfile.yearOfExperience || 0,
      industry: Array.isArray(mappedProfile.industry)
        ? mappedProfile.industry
        : [],
      telegramUserId: mappedProfile.telegramUserId || '',
      preferredJobLocation: Array.isArray(mappedProfile.preferredJobLocation)
        ? mappedProfile.preferredJobLocation
        : [],
      highestLevelOfEducation: mappedProfile.highestLevelOfEducation || '',
      salaryExpectations: mappedProfile.salaryExpectations || 0,
      aiGeneratedJobFitScore: mappedProfile.aiGeneratedJobFitScore || 0,
      technicalSkills: Array.isArray(mappedProfile.technicalSkills)
        ? mappedProfile.technicalSkills
        : [],
      softSkills: Array.isArray(mappedProfile.softSkills)
        ? mappedProfile.softSkills
        : [],
      profile: mappedProfile.profile || {},
      resume: mappedProfile.resume || {},
      educations: Array.isArray(mappedProfile.educations)
        ? mappedProfile.educations
        : [],
      experiences: Array.isArray(mappedProfile.experiences)
        ? mappedProfile.experiences
        : [],
      socialMediaLinks: mappedProfile.socialMediaLinks || {},
      profileHeadLine: mappedProfile.profileHeadLine || '',
      coverLetter: mappedProfile.coverLetter || '',
      professionalSummery: mappedProfile.professionalSummery || '',
      notificationSetting: Array.isArray(mappedProfile.notificationSetting)
        ? mappedProfile.notificationSetting
        : [],
      alertConfiguration: Array.isArray(mappedProfile.alertConfiguration)
        ? mappedProfile.alertConfiguration
        : [],
      smsAlertConfiguration: Array.isArray(mappedProfile.smsAlertConfiguration)
        ? mappedProfile.smsAlertConfiguration
        : [],
      isProfilePublic: mappedProfile.isProfilePublic || false,
      isResumePublic: mappedProfile.isResumePublic || false,
      isFirstTime: mappedProfile.isFirstTime || false,
    };

    return userProfile;
  } catch (error) {
    console.error('Error in AI mapping:', error);
    throw new Error('Failed to map extracted data to UserProfile');
  }
}

export const cvParsingService = {
  async extractCVFromFile(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/groq/extract-cv-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error extracting CV from file:', error);
      throw error;
    }
  },
};
