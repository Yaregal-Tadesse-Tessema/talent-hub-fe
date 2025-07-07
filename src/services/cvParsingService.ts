/* eslint-disable no-useless-escape */
import { CohereClient } from 'cohere-ai';
import { UserProfile } from '@/types/profile';

// Helper function to fix malformed JSON
function fixMalformedJSON(jsonText: string): string {
  let fixed = jsonText;

  // Remove any text before the first {
  const firstBrace = fixed.indexOf('{');
  if (firstBrace > 0) {
    fixed = fixed.substring(firstBrace);
  }

  // Remove any text after the last }
  const lastBrace = fixed.lastIndexOf('}');
  if (lastBrace > 0 && lastBrace < fixed.length - 1) {
    fixed = fixed.substring(0, lastBrace + 1);
  }

  // Fix unquoted property names (but preserve already quoted ones)
  fixed = fixed.replace(/([^"].*?):/g, '$1":');

  // Fix unquoted string values (but be careful with numbers and booleans)
  fixed = fixed.replace(
    /:\s*([^",{}\[\]\d\s][^,{}\[\]]*[^",{}\[\]\d\s])\s*([,}\]])/g,
    ': "$1"$2',
  );

  // Fix missing quotes in object keys
  fixed = fixed.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  // Fix boolean and null values
  fixed = fixed.replace(/:\s*true\s*([,}\]])/g, ': true$1');
  fixed = fixed.replace(/:\s*false\s*([,}\]])/g, ': false$1');
  fixed = fixed.replace(/:\s*null\s*([,}\]])/g, ': null$1');

  // Fix numeric values
  fixed = fixed.replace(/:\s*(\d+\.?\d*)\s*([,}\]])/g, ': $1$2');

  // Remove trailing commas
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Fix missing quotes around array values
  fixed = fixed.replace(/\[\s*([^",{}\]]+)\s*\]/g, '["$1"]');

  // Ensure proper array formatting
  fixed = fixed.replace(/\[\s*([^"\]]+)\s*\]/g, '["$1"]');

  // Fix common escape issues
  fixed = fixed.replace(/"/g, '"');
  fixed = fixed.replace(/\\/g, '\\');

  // Fix nested object issues
  fixed = fixed.replace(/\{\s*([^":]+):/g, '{"$1":');

  // Remove any remaining problematic characters
  fixed = fixed.replace(/[^\x20-\x7E]/g, '');

  return fixed;
}

// Helper function to create fallback data structure
function createFallbackDataStructure(jsonText: string): ParsedCVData {
  console.log('Creating fallback data structure from text:', jsonText);

  // Extract basic information using regex patterns
  const emailMatch = jsonText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  );
  const phoneMatch = jsonText.match(/[\+]?[1-9][\d]{0,15}/);
  const nameMatch = jsonText.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/);

  // Extract skills (look for common skill patterns)
  const skillPatterns = [
    /(?:skills?|technologies?|languages?|tools?)[:\s]*([^,\n]+)/gi,
    /(javascript|react|node|python|java|c\+\+|html|css|sql|aws|docker|git|typescript|angular|vue|php|ruby|go|rust|swift|kotlin)/gi,
  ];

  // Extract medical/healthcare skills
  const medicalSkillPatterns = [
    /(?:medical|clinical|healthcare|patient|diagnosis|treatment|surgery|emergency|primary care|general practice|psychiatry|anaesthetics|public health)/gi,
    /(communication|teamwork|leadership|problem solving|critical thinking|patient care|clinical skills|diagnostic skills|treatment planning|emergency response|primary care|general practice|psychiatry|anaesthetics|public health)/gi,
  ];

  const skills: string[] = [];
  skillPatterns.forEach((pattern) => {
    const matches = jsonText.match(pattern);
    if (matches) {
      skills.push(...matches.slice(1).filter(Boolean));
    }
  });

  // Add medical skills if found
  medicalSkillPatterns.forEach((pattern) => {
    const matches = jsonText.match(pattern);
    if (matches) {
      skills.push(...matches.filter(Boolean));
    }
  });

  // Create properly typed fallback data structure
  const fallbackData: ParsedCVData = {
    firstName: nameMatch ? nameMatch[1] : '',
    middleName: '',
    lastName: nameMatch ? nameMatch[2] : '',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    gender: '',
    birthDate: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    linkedinUrl: '',
    portfolioUrl: '',
    yearOfExperience: 0,
    industry: [],
    telegramUserId: '',
    preferredJobLocation: [],
    highestLevelOfEducation: '',
    salaryExpectations: 0,
    technicalSkills: skills.slice(0, 10), // Limit to 10 skills
    softSkills: [],
    profileHeadLine: '',
    coverLetter: '',
    professionalSummery: '',
    educations: {},
    experiences: {},
    socialMediaLinks: {},
  };

  console.log('Created fallback data structure:', fallbackData);
  return fallbackData;
}

// Helper function to normalize education and experience data
function normalizeEducationAndExperienceData(parsedData: any): ParsedCVData {
  // Normalize educations
  const normalizedEducations: Record<string, any> = {};
  if (parsedData.educations && typeof parsedData.educations === 'object') {
    Object.entries(parsedData.educations).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Parse education string like "Anytown Medical School, Anytown. 2009-2014"
        const educationMatch = value.match(
          /^(.+?),\s*(.+?)\.\s*(\d{4})-(\d{4})/,
        );
        if (educationMatch) {
          normalizedEducations[key] = {
            degree: key,
            institution: educationMatch[1].trim(),
            field: educationMatch[2].trim(),
            startDate: educationMatch[3],
            endDate: educationMatch[4],
            current: false,
            description: '',
            location: educationMatch[2].trim(),
          };
        } else {
          // Fallback if parsing fails
          normalizedEducations[key] = {
            degree: key,
            institution: value,
            field: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            location: '',
          };
        }
      } else if (typeof value === 'object') {
        normalizedEducations[key] = value;
      }
    });
  }

  // Normalize experiences - handle the complex nested structure from the console output
  const normalizedExperiences: Record<string, any> = {};
  if (parsedData.experiences && typeof parsedData.experiences === 'object') {
    Object.entries(parsedData.experiences).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Parse experience string like "Any Surgery, Derby. Aug 2020 - Aug 2021"
        const experienceMatch = value.match(
          /^(.+?),\s*(.+?)\.\s*(.+?)\s*-\s*(.+)/,
        );
        if (experienceMatch) {
          normalizedExperiences[key] = {
            position: key,
            company: experienceMatch[1].trim(),
            startDate: experienceMatch[3].trim(),
            endDate: experienceMatch[4].trim(),
            current: experienceMatch[4].toLowerCase().includes('present'),
            description: '',
            location: experienceMatch[2].trim(),
          };
        } else {
          // Fallback if parsing fails
          normalizedExperiences[key] = {
            position: key,
            company: value,
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            location: '',
          };
        }
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested object structure like {"GP Registrar": {"Any Surgery, Derby. Aug 2020 - Aug 2021": "description"}}
        if (Object.keys(value).length === 1) {
          const [companyInfo, description] = Object.entries(value)[0];
          const experienceMatch = companyInfo.match(
            /^(.+?),\s*(.+?)\.\s*(.+?)\s*-\s*(.+)/,
          );
          if (experienceMatch) {
            normalizedExperiences[key] = {
              position: key,
              company: experienceMatch[1].trim(),
              startDate: experienceMatch[3].trim(),
              endDate: experienceMatch[4].trim(),
              current: experienceMatch[4].toLowerCase().includes('present'),
              description: description || '',
              location: experienceMatch[2].trim(),
            };
          } else {
            normalizedExperiences[key] = {
              position: key,
              company: companyInfo,
              startDate: '',
              endDate: '',
              current: false,
              description: description || '',
              location: '',
            };
          }
        } else {
          normalizedExperiences[key] = value;
        }
      }
    });
  }

  return {
    ...parsedData,
    educations: normalizedEducations,
    experiences: normalizedExperiences,
  };
}

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY || '',
});

export interface ParsedCVData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
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

export async function parseCVFromText(
  cvText: string,
  retryCount = 0,
): Promise<ParsedCVData> {
  const maxRetries = 2;

  try {
    console.log(
      `Parsing CV text with Cohere AI... (attempt ${retryCount + 1})`,
    );

    // Optimize CV text for faster processing
    const optimizedText = cvText
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n+/g, ' ') // Replace multiple newlines with single space
      .replace(/[^\w\s@.-]/g, ' ') // Remove special characters that might confuse the AI
      .trim()
      .substring(0, 2500); // Further limit text length for faster processing

    const prompt = `Parse this CV and return JSON only:

CV: ${optimizedText}

Return this exact JSON structure (fill with extracted data or empty values):
{
  "firstName": "",
  "middleName": "",
  "lastName": "",
  "email": "",
  "phone": "",
  "gender": "",
  "birthDate": "",
  "address": {"street": "", "city": "", "state": "", "postalCode": "", "country": ""},
  "linkedinUrl": "",
  "portfolioUrl": "",
  "yearOfExperience": 0,
  "industry": [],
  "telegramUserId": "",
  "preferredJobLocation": [],
  "highestLevelOfEducation": "",
  "salaryExpectations": 0,
  "technicalSkills": [],
  "softSkills": [],
  "profileHeadLine": "",
  "coverLetter": "",
  "professionalSummery": "",
  "educations": {},
  "experiences": {},
  "socialMediaLinks": {"linkedin": "", "github": "", "twitter": "", "facebook": "", "instagram": ""}
}`;

    // Add timeout to prevent hanging requests (increased to 60 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('Request timeout - please try again')),
        60000,
      ); // 60 second timeout
    });

    const generatePromise = cohere.generate({
      prompt,
      maxTokens: 1000, // Reduced for faster response
      temperature: 0.05, // Very low temperature for consistent parsing
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE',
    });

    let response;
    try {
      response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        throw new Error(
          'CV parsing is taking longer than expected. Please try again with a shorter CV or check your internet connection.',
        );
      }
      throw error;
    }

    if (!response.generations || response.generations.length === 0) {
      throw new Error('No response generated from AI');
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

    console.log('Generated JSON text:', jsonText);

    // Parse the JSON response with comprehensive fallback
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Attempting to fix malformed JSON...');

      // Multiple attempts to fix JSON issues
      const fixedJson = fixMalformedJSON(jsonText);

      try {
        parsedData = JSON.parse(fixedJson);
        console.log('Successfully fixed and parsed JSON');
      } catch (secondError) {
        console.error('Failed to fix JSON:', secondError);
        console.log('Attempting to create fallback data structure...');

        // Create a fallback data structure if JSON parsing completely fails
        parsedData = createFallbackDataStructure(jsonText);
      }
    }

    console.log('Raw parsed data before validation:', parsedData);

    // Validate and clean the parsed data
    console.log('Raw parsed data before validation:', parsedData);

    const validatedData: ParsedCVData = {
      firstName: parsedData.firstName || '',
      middleName: parsedData.middleName || '',
      lastName: parsedData.lastName || '',
      email: parsedData.email || '',
      phone: parsedData.phone || '',
      gender: parsedData.gender || '',
      birthDate: parsedData.birthDate || '',
      address: {
        street: parsedData.address?.street || '',
        city: parsedData.address?.city || '',
        state: parsedData.address?.state || '',
        postalCode: parsedData.address?.postalCode || '',
        country: parsedData.address?.country || '',
      },
      linkedinUrl: parsedData.linkedinUrl || '',
      portfolioUrl: parsedData.portfolioUrl || '',
      yearOfExperience: parseInt(parsedData.yearOfExperience) || 0,
      industry: Array.isArray(parsedData.industry) ? parsedData.industry : [],
      telegramUserId: parsedData.telegramUserId || '',
      preferredJobLocation: Array.isArray(parsedData.preferredJobLocation)
        ? parsedData.preferredJobLocation
        : [],
      highestLevelOfEducation: parsedData.highestLevelOfEducation || '',
      salaryExpectations: parseInt(parsedData.salaryExpectations) || 0,
      technicalSkills: Array.isArray(parsedData.technicalSkills)
        ? parsedData.technicalSkills
        : [],
      softSkills: Array.isArray(parsedData.softSkills)
        ? parsedData.softSkills
        : [],
      profileHeadLine: parsedData.profileHeadLine || '',
      coverLetter: parsedData.coverLetter || '',
      professionalSummery: parsedData.professionalSummery || '',
      educations: parsedData.educations || {},
      experiences: parsedData.experiences || {},
      socialMediaLinks: parsedData.socialMediaLinks || {},
    };

    console.log('Validated CV data:', validatedData);
    console.log('Data types check:', {
      firstName: typeof validatedData.firstName,
      lastName: typeof validatedData.lastName,
      email: typeof validatedData.email,
      phone: typeof validatedData.phone,
      address: typeof validatedData.address,
      technicalSkills: Array.isArray(validatedData.technicalSkills),
    });

    // Normalize education and experience data
    const normalizedData = normalizeEducationAndExperienceData(validatedData);
    console.log('Normalized CV data:', normalizedData);

    return normalizedData;
  } catch (error) {
    console.error('Error parsing CV:', error);

    // Retry logic for certain errors
    if (retryCount < maxRetries) {
      if (error instanceof Error) {
        if (
          error.message.includes('timeout') ||
          error.message.includes('API')
        ) {
          console.log(`Retrying CV parsing... (attempt ${retryCount + 2})`);
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return parseCVFromText(cvText, retryCount + 1);
        }
      }
    }

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error(
          'CV parsing timed out after multiple attempts. Please try again with a shorter CV or check your internet connection.',
        );
      } else if (error.message.includes('API')) {
        throw new Error(
          'AI service is temporarily unavailable. Please try again in a few minutes.',
        );
      } else if (error.message.includes('JSON')) {
        throw new Error(
          "The AI response was malformed. We've attempted to extract what we could from your CV. Please review and edit the parsed data.",
        );
      } else {
        throw new Error(`CV parsing failed: ${error.message}`);
      }
    }

    throw new Error(
      'Failed to parse CV. Please ensure the CV text is clear and well-formatted.',
    );
  }
}

export function mapParsedDataToUserProfile(
  parsedData: ParsedCVData,
  userId: string,
): UserProfile {
  console.log('Mapping parsed data to UserProfile:', parsedData);

  // Handle birthDate properly - if empty or invalid, set to null or a default date
  let birthDate: string | null = parsedData.birthDate;
  if (!birthDate || birthDate.trim() === '') {
    birthDate = null; // Set to null instead of empty string
  } else {
    // Validate the date format
    try {
      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        birthDate = null; // Invalid date, set to null
      } else {
        birthDate = date.toISOString(); // Format as ISO timestamp for backend
      }
    } catch (error) {
      birthDate = null; // Error parsing date, set to null
    }
  }

  // Helper function to validate and clean date fields
  const cleanDateField = (dateValue: any): string => {
    if (!dateValue || typeof dateValue !== 'string') return '';

    const trimmed = dateValue.trim();
    if (
      trimmed === '' ||
      trimmed === 'Unknown' ||
      trimmed === 'null' ||
      trimmed === 'undefined'
    ) {
      return '';
    }

    // Try to parse the date
    try {
      const date = new Date(trimmed);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString(); // Return ISO timestamp format for backend
    } catch (error) {
      return '';
    }
  };

  // Recursive function to clean all date fields in an object
  const cleanObjectDates = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => cleanObjectDates(item));
    }

    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        cleaned[key] = cleanObjectDates(value);
      } else if (
        typeof value === 'string' &&
        key.toLowerCase().includes('date')
      ) {
        // Clean any field that contains 'date' in its name
        cleaned[key] = cleanDateField(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  // Clean up experiences and educations to ensure no invalid date fields
  const cleanExperiences = Object.values(parsedData.experiences || {}).map(
    (exp: any) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      jobTitle: exp.position || exp.jobTitle || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: cleanDateField(exp.startDate),
      endDate: exp.current ? '' : cleanDateField(exp.endDate),
      current: exp.current || false,
      description: exp.description || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
    }),
  );

  const cleanEducations = Object.values(parsedData.educations || {}).map(
    (edu: any) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      degree: edu.degree || '',
      institution: edu.institution || '',
      location: edu.location || '',
      startDate: cleanDateField(edu.startDate),
      endDate: edu.current ? '' : cleanDateField(edu.endDate),
      current: edu.current || false,
      gpa: edu.gpa || 0,
      courses: Array.isArray(edu.courses) ? edu.courses : [],
      description: edu.description || '',
    }),
  );

  const userProfile: UserProfile = {
    id: userId,
    phone: parsedData.phone || '',
    email: parsedData.email || '',
    firstName: parsedData.firstName || '',
    middleName: parsedData.middleName || '',
    lastName: parsedData.lastName || '',
    gender: parsedData.gender || '',
    status: 'Active', // Set default status as required by backend
    address: (parsedData.address as Record<string, any>) || {}, // Convert to expected type
    birthDate: birthDate || '1990-01-01T00:00:00.000Z', // Use a reasonable default date
    linkedinUrl: parsedData.linkedinUrl || '',
    portfolioUrl: parsedData.portfolioUrl || '',
    yearOfExperience: parsedData.yearOfExperience || 0,
    industry: parsedData.industry || [],
    telegramUserId: parsedData.telegramUserId || '',
    preferredJobLocation: parsedData.preferredJobLocation || [],
    highestLevelOfEducation: parsedData.highestLevelOfEducation || '',
    salaryExpectations: parsedData.salaryExpectations || 0,
    aiGeneratedJobFitScore: 0, // This will be calculated separately
    technicalSkills: parsedData.technicalSkills || [],
    softSkills: parsedData.softSkills || [],
    profile: { path: '' }, // FileInfo will be handled separately
    resume: { path: '' }, // FileInfo will be handled separately
    educations: cleanEducations,
    experiences: cleanExperiences,
    socialMediaLinks: parsedData.socialMediaLinks || {},
    profileHeadLine: parsedData.profileHeadLine || '',
    coverLetter: parsedData.coverLetter || '',
    professionalSummery: parsedData.professionalSummery || '',
    isProfilePublic: false,
    isResumePublic: false,
    notificationSetting: [],
    alertConfiguration: [],
    smsAlertConfiguration: [],
    isFirstTime: false,
  };

  // Clean all date fields in the entire userProfile object
  const cleanedUserProfile = cleanObjectDates(userProfile);

  // Ensure all required fields have proper fallback values
  const finalUserProfile = {
    ...cleanedUserProfile,
    // Ensure arrays are always arrays
    industry: cleanedUserProfile.industry || [],
    preferredJobLocation: cleanedUserProfile.preferredJobLocation || [],
    technicalSkills: cleanedUserProfile.technicalSkills || [],
    softSkills: cleanedUserProfile.softSkills || [],
    notificationSetting: cleanedUserProfile.notificationSetting || [],
    alertConfiguration: cleanedUserProfile.alertConfiguration || [],
    smsAlertConfiguration: cleanedUserProfile.smsAlertConfiguration || [],
    // Ensure objects are always objects
    address: cleanedUserProfile.address || {},
    educations: cleanedUserProfile.educations || {},
    experiences: cleanedUserProfile.experiences || {},
    socialMediaLinks: cleanedUserProfile.socialMediaLinks || {},
    profile: cleanedUserProfile.profile || { path: '' },
    resume: cleanedUserProfile.resume || { path: '' },
    // Ensure strings are never undefined
    phone: cleanedUserProfile.phone || '',
    email: cleanedUserProfile.email || '',
    firstName: cleanedUserProfile.firstName || '',
    middleName: cleanedUserProfile.middleName || '',
    lastName: cleanedUserProfile.lastName || '',
    gender: cleanedUserProfile.gender || '',
    status: cleanedUserProfile.status || 'Active',
    birthDate: cleanedUserProfile.birthDate || '1990-01-01T00:00:00.000Z',
    linkedinUrl: cleanedUserProfile.linkedinUrl || '',
    portfolioUrl: cleanedUserProfile.portfolioUrl || '',
    telegramUserId: cleanedUserProfile.telegramUserId || '',
    highestLevelOfEducation: cleanedUserProfile.highestLevelOfEducation || '',
    profileHeadLine: cleanedUserProfile.profileHeadLine || '',
    coverLetter: cleanedUserProfile.coverLetter || '',
    professionalSummery: cleanedUserProfile.professionalSummery || '',
    // Ensure numbers are never undefined
    yearOfExperience: cleanedUserProfile.yearOfExperience || 0,
    salaryExpectations: cleanedUserProfile.salaryExpectations || 0,
    aiGeneratedJobFitScore: cleanedUserProfile.aiGeneratedJobFitScore || 0,
    // Ensure booleans are never undefined
    isProfilePublic: cleanedUserProfile.isProfilePublic || false,
    isResumePublic: cleanedUserProfile.isResumePublic || false,
  };

  console.log('Final cleaned user profile:', finalUserProfile);
  return finalUserProfile;
}

// Helper function to extract text from PDF (you'll need to implement this based on your PDF parsing library)
export async function extractTextFromPDF(file: File): Promise<string> {
  // This is a placeholder - you'll need to implement PDF text extraction
  // You can use libraries like pdf-parse, pdfjs-dist, or similar
  throw new Error(
    'PDF text extraction not implemented. Please implement this function using a PDF parsing library.',
  );
}

// Main function to parse CV from file
export async function parseCVFromFile(
  file: File,
  userId: string,
): Promise<{
  parsedData: ParsedCVData;
  userProfile: UserProfile;
}> {
  try {
    // Extract text from the file
    let cvText: string;

    if (file.type === 'application/pdf') {
      cvText = await extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      cvText = await file.text();
    } else {
      throw new Error(
        'Unsupported file type. Please upload a PDF or text file.',
      );
    }

    // Parse the CV text
    const parsedData = await parseCVFromText(cvText);

    // Map to UserProfile
    const userProfile = mapParsedDataToUserProfile(parsedData, userId);

    return { parsedData, userProfile };
  } catch (error) {
    console.error('Error parsing CV from file:', error);
    throw error;
  }
}
