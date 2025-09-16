import { CohereClient } from 'cohere-ai';

// Initialize Cohere client - using the same pattern as cvParsingService.ts
const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY || '',
});

export interface JobDescriptionRequest {
  title: string;
  position: string;
  industry: string;
  employmentType: string;
}

export interface JobDescriptionResponse {
  description: string;
  success: boolean;
  error?: string;
}

export class JobDescriptionService {
  /**
   * Generate a job description using Cohere AI based on basic job information
   */
  async generateJobDescription(
    request: JobDescriptionRequest,
  ): Promise<JobDescriptionResponse> {
    console.log(
      '🚀 Starting job description generation with request:',
      request,
    );

    try {
      // Validate required fields
      if (
        !request.title ||
        !request.position ||
        !request.industry ||
        !request.employmentType
      ) {
        console.log('❌ Validation failed - missing required fields');
        return {
          description: '',
          success: false,
          error:
            'Missing required job information. Please fill in job title, position, industry, and employment type.',
        };
      }

      console.log('✅ Validation passed, proceeding with AI generation');

      // Create a comprehensive prompt for job description generation
      const prompt = `You are an expert HR professional and job description writer. Generate a comprehensive, professional job description based on the following information:

Job Title: ${request.title}
Position: ${request.position}
Industry: ${request.industry}
Employment Type: ${request.employmentType}

Please create a detailed job description that includes:

1. **Company Overview Section** - Brief introduction about the company and role
2. **Job Summary** - Clear overview of the position and its importance
3. **Key Responsibilities** - 5-7 main responsibilities in bullet points
4. **Required Qualifications** - Essential skills, experience, and education
5. **Preferred Qualifications** - Nice-to-have skills and experience
6. **What We Offer** - Benefits and perks (mention competitive salary, benefits, growth opportunities)
7. **Application Instructions** - How to apply

Guidelines:
- Use professional, engaging language
- Make it attractive to potential candidates
- Include specific, actionable responsibilities
- Be clear about requirements vs. preferences
- Keep it comprehensive but concise (aim for 400-600 words)
- Use HTML formatting with proper tags for structure
- Make it industry-specific and relevant

Format the response as HTML with proper paragraph tags, bullet points, and headings.`;

      console.log('📝 Sending request to Cohere AI...');
      const response = await cohere.generate({
        prompt,
        maxTokens: 800,
        temperature: 0.7,
        k: 0,
        stopSequences: [],
        returnLikelihoods: 'NONE',
      });

      console.log('🤖 Cohere AI response:', response);

      if (!response.generations || response.generations.length === 0) {
        console.log('❌ No generations in response');
        return {
          description: '',
          success: false,
          error: 'Failed to generate job description. Please try again.',
        };
      }

      const generatedDescription = response.generations[0].text.trim();
      console.log('📄 Generated description:', generatedDescription);

      // Clean up the response and ensure it's properly formatted
      let cleanedDescription = generatedDescription;

      // Remove any markdown formatting if present
      if (cleanedDescription.startsWith('```html')) {
        cleanedDescription = cleanedDescription
          .replace(/```html\n?/, '')
          .replace(/```\n?/, '');
      } else if (cleanedDescription.startsWith('```')) {
        cleanedDescription = cleanedDescription
          .replace(/```\n?/, '')
          .replace(/```\n?/, '');
      }

      // Ensure proper HTML structure
      if (
        !cleanedDescription.includes('<p>') &&
        !cleanedDescription.includes('<h')
      ) {
        // If no HTML tags, wrap in paragraphs
        const paragraphs = cleanedDescription
          .split('\n\n')
          .filter((p: string) => p.trim());
        cleanedDescription = paragraphs
          .map((p: string) => `<p>${p.trim()}</p>`)
          .join('\n');
      }

      console.log('✅ Successfully generated and cleaned description');
      return {
        description: cleanedDescription,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error generating job description:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Return a fallback description if AI fails
      const fallbackDescription = this.generateFallbackDescription(request);
      console.log('🔄 Using fallback description');

      return {
        description: fallbackDescription,
        success: false,
        error:
          'AI generation failed. Using template description. You can edit this as needed.',
      };
    }
  }

  /**
   * Generate a fallback job description template when AI fails
   */
  private generateFallbackDescription(request: JobDescriptionRequest): string {
    return `
      <h3>About the Role</h3>
      <p>We are seeking a talented <strong>${request.title}</strong> to join our team in the <strong>${request.industry}</strong> industry. This is a <strong>${request.employmentType}</strong> position that offers excellent growth opportunities.</p>
      
      <h3>Job Summary</h3>
      <p>As a ${request.title}, you will play a key role in our organization, contributing to our success through your expertise and dedication.</p>
      
      <h3>Key Responsibilities</h3>
      <ul>
        <li>Execute core responsibilities related to ${request.position}</li>
        <li>Collaborate with cross-functional teams</li>
        <li>Contribute to project planning and execution</li>
        <li>Maintain high standards of quality and performance</li>
        <li>Participate in continuous improvement initiatives</li>
      </ul>
      
      <h3>Required Qualifications</h3>
      <ul>
        <li>Relevant experience in ${request.industry}</li>
        <li>Strong problem-solving and analytical skills</li>
        <li>Excellent communication and interpersonal skills</li>
        <li>Ability to work independently and as part of a team</li>
      </ul>
      
      <h3>What We Offer</h3>
      <ul>
        <li>Competitive salary and benefits package</li>
        <li>Professional development opportunities</li>
        <li>Collaborative and inclusive work environment</li>
        <li>Career growth and advancement opportunities</li>
      </ul>
      
      <h3>How to Apply</h3>
      <p>If you are interested in this opportunity, please submit your application through our platform. We look forward to hearing from you!</p>
    `;
  }

  /**
   * Validate job description request
   */
  validateRequest(request: JobDescriptionRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.title?.trim()) {
      errors.push('Job title is required');
    }

    if (!request.position?.trim()) {
      errors.push('Position is required');
    }

    if (!request.industry?.trim()) {
      errors.push('Industry is required');
    }

    if (!request.employmentType?.trim()) {
      errors.push('Employment type is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const jobDescriptionService = new JobDescriptionService();
