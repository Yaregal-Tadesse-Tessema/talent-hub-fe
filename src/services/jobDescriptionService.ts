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
    try {
      // Validate required fields
      if (
        !request.title ||
        !request.position ||
        !request.industry ||
        !request.employmentType
      ) {
        return {
          description: '',
          success: false,
          error:
            'Missing required job information. Please fill in job title, position, industry, and employment type.',
        };
      }

      // Create a comprehensive prompt for job description generation
      const prompt = `You are an expert HR professional and job description writer. Generate a comprehensive, professional job description based on the following information:

Job Title: ${request.title}
Position: ${request.position}
Industry: ${request.industry}
Employment Type: ${request.employmentType}

IMPORTANT: Generate ONLY the job description content without any introductory text, titles, or headers. Do not include phrases like "Here is a job description" or the job title as a main heading.

Please create a detailed job description following this EXACT structure and format:

<h2>About the Company</h2>
<p>Brief introduction about the company, mission, values, and culture in the ${request.industry} industry. Mention what makes the company unique and why it's an attractive place to work.</p>

<h2>Job Overview</h2>
<p>3-4 sentences summarizing the ${request.title} role. Mention the team they'll work with, who they report to, and the main purpose of this position. Make it engaging and specific to the ${request.industry} industry.</p>

<h2>Key Responsibilities</h2>
<ul>
<li>Start each responsibility with an action verb (Design, Lead, Implement, Collaborate, Manage, Develop, etc.)</li>
<li>Create 6-8 specific, actionable responsibilities relevant to a ${request.title} in ${request.industry}</li>
<li>Make responsibilities appropriate for the role level and industry</li>
<li>Focus on day-to-day tasks and strategic objectives</li>
<li>Include collaboration and communication aspects</li>
<li>Mention specific tools, technologies, or methodologies when relevant</li>
</ul>

<h2>Requirements</h2>
<h3>Must-have:</h3>
<ul>
<li>Education requirements (degree, certifications)</li>
<li>Years of experience required</li>
<li>Core technical skills for ${request.title}</li>
<li>Industry-specific knowledge for ${request.industry}</li>
<li>Essential soft skills</li>
</ul>

<h3>Nice-to-have:</h3>
<ul>
<li>Additional technical skills that give candidates an edge</li>
<li>Bonus experience or certifications</li>
<li>Leadership or mentoring experience (if senior role)</li>
<li>Specific tools or platform experience</li>
</ul>

<h2>What We Offer</h2>
<ul>
<li>Competitive salary and comprehensive benefits package</li>
<li>Health, dental, and vision insurance</li>
<li>Professional development and learning opportunities</li>
<li>Flexible work arrangements (mention remote/hybrid options for ${request.employmentType})</li>
<li>Career growth and advancement opportunities</li>
<li>Collaborative and inclusive work environment</li>
<li>Industry-specific perks relevant to ${request.industry}</li>
</ul>

<h2>Location & Work Setup</h2>
<p>Specify work arrangement based on ${request.employmentType} - whether it's remote, hybrid, or on-site. Mention any travel requirements if applicable.</p>

<h2>Application Process</h2>
<p>Professional instructions on how to apply, what documents to submit, and what candidates can expect in the hiring process. Keep it welcoming and encouraging.</p>

Guidelines:
- Use professional, engaging language that attracts top talent
- Be specific to the ${request.industry} industry
- Make responsibilities actionable and measurable where possible
- Use HTML formatting with proper <h2>, <h3>, <ul>, <li>, and <p> tags
- Keep content concise but comprehensive (400-600 words)
- Avoid generic phrases - be specific to the role and industry
- Use bullet points for lists (ul/li tags)
- Make it sound like a real company posting

Generate the content now:`;

      const response = await cohere.chat({
        model: 'command-r-08-2024',
        message: prompt,
        maxTokens: 800,
        temperature: 0.7,
      });

      if (!response.text) {
        return {
          description: '',
          success: false,
          error: 'Failed to generate job description. Please try again.',
        };
      }

      const generatedDescription = response.text.trim();

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

      // Remove full HTML document structure if present and extract body content
      if (
        cleanedDescription.includes('<!DOCTYPE html>') ||
        cleanedDescription.includes('<html')
      ) {
        // Extract content between <body> tags or after introductory text
        const bodyMatch = cleanedDescription.match(
          /<body[^>]*>([\s\S]*?)<\/body>/i,
        );
        if (bodyMatch) {
          cleanedDescription = bodyMatch[1].trim();
        } else {
          // If no body tags, try to extract content after the introductory sentence
          const lines = cleanedDescription.split('\n');
          const contentStart = lines.findIndex(
            (line) =>
              line.includes('<h1>') ||
              line.includes('<h2>') ||
              line.includes('<p>'),
          );
          if (contentStart > 0) {
            cleanedDescription = lines.slice(contentStart).join('\n').trim();
          }
        }
      }

      // Remove any remaining HTML document elements
      cleanedDescription = cleanedDescription
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<html[^>]*>/gi, '')
        .replace(/<\/html>/gi, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<body[^>]*>/gi, '')
        .replace(/<\/body>/gi, '')
        .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
        .replace(/<meta[^>]*>/gi, '')
        .trim();

      // Remove introductory text if present
      if (
        cleanedDescription.startsWith('Certainly!') ||
        cleanedDescription.startsWith('Here is') ||
        cleanedDescription.startsWith("Here's a") ||
        cleanedDescription.includes('job description for') ||
        cleanedDescription.includes('professionally crafted')
      ) {
        const lines = cleanedDescription.split('\n');
        const contentStart = lines.findIndex(
          (line) =>
            line.includes('<h2>About the Company</h2>') ||
            line.includes('<h2>') ||
            line.includes('<h1>') ||
            line.includes('<p>'),
        );
        if (contentStart > 0) {
          cleanedDescription = lines.slice(contentStart).join('\n').trim();
        }
      }

      // Remove any remaining job title headers that might appear
      cleanedDescription = cleanedDescription
        .replace(/<h1[^>]*>.*?<\/h1>/gi, '')
        .replace(/^#\s+.*$/gm, '') // Remove markdown headers
        .replace(/^\*\*.*\*\*$/gm, '') // Remove bold markdown headers
        .trim();

      // Ensure proper HTML structure if no HTML tags present
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

      return {
        description: cleanedDescription,
        success: true,
      };
    } catch (error) {
      // Return a fallback description if AI fails
      const fallbackDescription = this.generateFallbackDescription(request);

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
      <h2>About the Company</h2>
      <p>We are a dynamic and growing organization in the ${request.industry} industry, committed to innovation and excellence. Our team is passionate about delivering outstanding results while fostering a collaborative and supportive work environment.</p>
      
      <h2>Job Overview</h2>
      <p>We are seeking a talented <strong>${request.title}</strong> to join our team. This ${request.employmentType.toLowerCase()} position offers an excellent opportunity to contribute to meaningful projects while advancing your career in the ${request.industry} field. You will work closely with our experienced team and play a key role in driving our continued success.</p>
      
      <h2>Key Responsibilities</h2>
      <ul>
        <li>Execute core responsibilities related to the ${request.position} role</li>
        <li>Collaborate effectively with cross-functional teams and stakeholders</li>
        <li>Contribute to project planning, execution, and delivery</li>
        <li>Maintain high standards of quality and performance in all deliverables</li>
        <li>Participate in continuous improvement initiatives and best practices</li>
        <li>Support team objectives and organizational goals</li>
      </ul>
      
      <h2>Requirements</h2>
      <h3>Must-have:</h3>
      <ul>
        <li>Relevant degree or equivalent experience in ${request.industry}</li>
        <li>Proven experience in ${request.position} or related field</li>
        <li>Strong problem-solving and analytical skills</li>
        <li>Excellent communication and interpersonal abilities</li>
        <li>Ability to work independently and as part of a team</li>
      </ul>
      
      <h3>Nice-to-have:</h3>
      <ul>
        <li>Additional certifications relevant to the role</li>
        <li>Experience with industry-specific tools and technologies</li>
        <li>Leadership or mentoring experience</li>
        <li>Multilingual capabilities</li>
      </ul>
      
      <h2>What We Offer</h2>
      <ul>
        <li>Competitive salary and comprehensive benefits package</li>
        <li>Health, dental, and vision insurance</li>
        <li>Professional development and learning opportunities</li>
        <li>Flexible work arrangements and work-life balance</li>
        <li>Career growth and advancement opportunities</li>
        <li>Collaborative and inclusive work environment</li>
      </ul>
      
      <h2>Location & Work Setup</h2>
      <p>This is a ${request.employmentType.toLowerCase()} position. We offer flexible work arrangements to support work-life balance and productivity.</p>
      
      <h2>Application Process</h2>
      <p>If you are interested in this exciting opportunity, please submit your resume and cover letter through our application portal. We review all applications carefully and will contact qualified candidates for the next steps in our hiring process. We look forward to hearing from you!</p>
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
