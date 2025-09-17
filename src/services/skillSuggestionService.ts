import { CohereClient } from 'cohere-ai';

// Initialize Cohere client
let cohere: CohereClient | null = null;

try {
  // Only initialize cohere if the API key is available
  if (process.env.NEXT_PUBLIC_COHERE_API_KEY) {
    cohere = new CohereClient({
      token: process.env.NEXT_PUBLIC_COHERE_API_KEY,
    });
  }
} catch (error) {
  // Cohere AI not available, will use fallback
}

export interface JobFormData {
  title: string;
  position: string;
  industry: string;
  description: string;
  experienceLevel: string;
  educationLevel: string;
  employmentType: string;
  responsibilities: string[];
  jobPostRequirement: string[];
}

export interface SkillSuggestion {
  skill: string;
  category: 'technical' | 'soft' | 'domain-specific';
  importance: 'high' | 'medium' | 'low';
  description: string;
}

export interface SkillSuggestionResult {
  suggestedSkills: SkillSuggestion[];
  success: boolean;
  error?: string;
}

export interface ResponsibilitySuggestionResult {
  suggestedResponsibilities: string[];
  success: boolean;
  error?: string;
}

export class SkillSuggestionService {
  /**
   * Generate skill suggestions based on job form data
   */
  async suggestSkills(
    jobData: Partial<JobFormData>,
  ): Promise<SkillSuggestionResult> {
    try {
      // Try to use Cohere AI for sophisticated skill suggestions
      if (cohere) {
        return await this.generateCohereSkillSuggestions(jobData);
      }
    } catch (error) {
      // Fallback on error
    }

    // Fallback to rule-based skill suggestions
    return this.generateFallbackSkillSuggestions(jobData);
  }

  /**
   * Generate responsibility suggestions based on job form data
   */
  async suggestResponsibilities(
    jobData: Partial<JobFormData>,
  ): Promise<ResponsibilitySuggestionResult> {
    try {
      // Try to use Cohere AI for sophisticated responsibility suggestions
      if (cohere) {
        return await this.generateCohereResponsibilitySuggestions(jobData);
      }
    } catch (error) {
      // Fallback on error
    }

    // Fallback to rule-based responsibility suggestions
    return this.generateFallbackResponsibilitySuggestions(jobData);
  }

  /**
   * Generate skill suggestions using Cohere AI
   */
  private async generateCohereSkillSuggestions(
    jobData: Partial<JobFormData>,
  ): Promise<SkillSuggestionResult> {
    if (!cohere) {
      throw new Error('Cohere AI not available');
    }

    const prompt = `As an expert HR consultant and technical recruiter, analyze the following job information and suggest the most relevant skills required for this position.

JOB INFORMATION:
- Job Title: ${jobData.title || 'Not specified'}
- Position: ${jobData.position || 'Not specified'}
- Industry: ${jobData.industry || 'Not specified'}
- Experience Level: ${jobData.experienceLevel || 'Not specified'}
- Education Level: ${jobData.educationLevel || 'Not specified'}
- Employment Type: ${jobData.employmentType || 'Not specified'}
- Job Description: ${jobData.description?.substring(0, 500) || 'Not provided'}...
- Responsibilities: ${jobData.responsibilities?.join(', ') || 'Not specified'}
- Requirements: ${jobData.jobPostRequirement?.join(', ') || 'Not specified'}

Please suggest 8-12 relevant skills for this position. Include a mix of technical skills, soft skills, and domain-specific skills.

Respond in JSON format:
{
  "suggestedSkills": [
    {
      "skill": "skill name",
      "category": "technical|soft|domain-specific",
      "importance": "high|medium|low",
      "description": "brief explanation of why this skill is important for the role"
    }
  ]
}

Focus on:
1. Industry-specific technical skills
2. Essential soft skills for the role
3. Tools and technologies commonly used in this field
4. Skills that match the experience level
5. Domain knowledge relevant to the industry

Make the suggestions practical and realistic for the specified position and experience level.`;

    const response = await cohere.chat({
      model: 'command-r-08-2024',
      message: prompt,
      maxTokens: 1000,
      temperature: 0.4,
    });

    if (!response.text) {
      return {
        suggestedSkills: [],
        success: false,
        error: 'Failed to generate skill suggestions. Please try again.',
      };
    }

    const responseText = response.text.trim();

    try {
      // Try to parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        if (parsed.suggestedSkills && Array.isArray(parsed.suggestedSkills)) {
          return {
            suggestedSkills: parsed.suggestedSkills,
            success: true,
          };
        }
      }
    } catch (parseError) {
      // Failed to parse, use fallback
    }

    // Fallback if JSON parsing fails
    return this.generateFallbackSkillSuggestions(jobData);
  }

  /**
   * Generate responsibility suggestions using Cohere AI
   */
  private async generateCohereResponsibilitySuggestions(
    jobData: Partial<JobFormData>,
  ): Promise<ResponsibilitySuggestionResult> {
    if (!cohere) {
      throw new Error('Cohere AI not available');
    }

    const prompt = `As an expert HR consultant and job description writer, analyze the following job information and suggest 6-8 key responsibilities for this position.

JOB INFORMATION:
- Job Title: ${jobData.title || 'Not specified'}
- Position: ${jobData.position || 'Not specified'}
- Industry: ${jobData.industry || 'Not specified'}
- Experience Level: ${jobData.experienceLevel || 'Not specified'}
- Education Level: ${jobData.educationLevel || 'Not specified'}
- Employment Type: ${jobData.employmentType || 'Not specified'}
- Job Description: ${jobData.description?.substring(0, 500) || 'Not provided'}...
- Current Responsibilities: ${jobData.responsibilities?.join(', ') || 'None specified'}
- Requirements: ${jobData.jobPostRequirement?.join(', ') || 'Not specified'}

Please suggest 6-8 key responsibilities that are:
1. Specific and actionable
2. Appropriate for the experience level
3. Relevant to the industry and role
4. Progressive in scope (from day-to-day tasks to strategic responsibilities)
5. Different from any existing responsibilities already listed

Respond in JSON format:
{
  "suggestedResponsibilities": [
    "First key responsibility with specific action and outcome",
    "Second responsibility focusing on collaboration or leadership",
    "Third responsibility about process improvement or optimization",
    "Fourth responsibility related to analysis or reporting",
    "Fifth responsibility about stakeholder management",
    "Sixth responsibility focusing on strategic planning or innovation"
  ]
}

Make each responsibility clear, professional, and start with an action verb (e.g., "Develop", "Manage", "Lead", "Analyze", "Coordinate").`;

    const response = await cohere.chat({
      model: 'command-r-08-2024',
      message: prompt,
      maxTokens: 800,
      temperature: 0.4,
    });

    if (!response.text) {
      return {
        suggestedResponsibilities: [],
        success: false,
        error:
          'Failed to generate responsibility suggestions. Please try again.',
      };
    }

    const responseText = response.text.trim();

    try {
      // Try to parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        if (
          parsed.suggestedResponsibilities &&
          Array.isArray(parsed.suggestedResponsibilities)
        ) {
          return {
            suggestedResponsibilities: parsed.suggestedResponsibilities,
            success: true,
          };
        }
      }
    } catch (parseError) {
      // Failed to parse, use fallback
    }

    // Fallback if JSON parsing fails
    return this.generateFallbackResponsibilitySuggestions(jobData);
  }

  /**
   * Generate fallback skill suggestions based on job data
   */
  private generateFallbackSkillSuggestions(
    jobData: Partial<JobFormData>,
  ): SkillSuggestionResult {
    const industry = jobData.industry?.toLowerCase() || '';
    const title = jobData.title?.toLowerCase() || '';
    const position = jobData.position?.toLowerCase() || '';
    const experienceLevel = jobData.experienceLevel?.toLowerCase() || '';

    const suggestedSkills: SkillSuggestion[] = [];

    // Technical skills based on industry and position
    if (
      industry.includes('technology') ||
      industry.includes('information') ||
      title.includes('software') ||
      title.includes('developer') ||
      title.includes('engineer') ||
      position.includes('developer')
    ) {
      suggestedSkills.push(
        {
          skill: 'JavaScript',
          category: 'technical',
          importance: 'high',
          description: 'Essential programming language for web development',
        },
        {
          skill: 'React',
          category: 'technical',
          importance: 'high',
          description:
            'Popular frontend framework for building user interfaces',
        },
        {
          skill: 'Node.js',
          category: 'technical',
          importance: 'medium',
          description: 'Server-side JavaScript runtime for backend development',
        },
        {
          skill: 'Git',
          category: 'technical',
          importance: 'high',
          description: 'Version control system for code management',
        },
        {
          skill: 'SQL',
          category: 'technical',
          importance: 'medium',
          description: 'Database query language for data management',
        },
        {
          skill: 'API Development',
          category: 'technical',
          importance: 'medium',
          description:
            'Building and integrating application programming interfaces',
        },
      );
    } else if (industry.includes('finance') || industry.includes('banking')) {
      suggestedSkills.push(
        {
          skill: 'Financial Analysis',
          category: 'domain-specific',
          importance: 'high',
          description: 'Analyzing financial data and market trends',
        },
        {
          skill: 'Excel',
          category: 'technical',
          importance: 'high',
          description: 'Advanced spreadsheet skills for financial modeling',
        },
        {
          skill: 'Risk Management',
          category: 'domain-specific',
          importance: 'high',
          description: 'Identifying and mitigating financial risks',
        },
        {
          skill: 'Regulatory Compliance',
          category: 'domain-specific',
          importance: 'medium',
          description: 'Understanding of financial regulations and compliance',
        },
      );
    } else if (industry.includes('marketing') || title.includes('marketing')) {
      suggestedSkills.push(
        {
          skill: 'Digital Marketing',
          category: 'domain-specific',
          importance: 'high',
          description: 'Online marketing strategies and campaigns',
        },
        {
          skill: 'Google Analytics',
          category: 'technical',
          importance: 'high',
          description: 'Web analytics and performance tracking',
        },
        {
          skill: 'SEO',
          category: 'technical',
          importance: 'medium',
          description: 'Search engine optimization techniques',
        },
        {
          skill: 'Content Marketing',
          category: 'domain-specific',
          importance: 'medium',
          description: 'Creating and distributing valuable content',
        },
      );
    }

    // Add common soft skills based on experience level
    const softSkills: SkillSuggestion[] = [
      {
        skill: 'Communication',
        category: 'soft',
        importance: 'high',
        description: 'Clear and effective verbal and written communication',
      },
      {
        skill: 'Problem Solving',
        category: 'soft',
        importance: 'high',
        description: 'Analytical thinking and creative solution finding',
      },
      {
        skill: 'Teamwork',
        category: 'soft',
        importance: 'high',
        description: 'Collaborative work and team coordination',
      },
      {
        skill: 'Time Management',
        category: 'soft',
        importance: 'medium',
        description: 'Efficient task prioritization and deadline management',
      },
    ];

    // Add leadership skills for senior positions
    if (
      experienceLevel.includes('senior') ||
      experienceLevel.includes('lead') ||
      title.includes('manager') ||
      title.includes('director')
    ) {
      softSkills.push(
        {
          skill: 'Leadership',
          category: 'soft',
          importance: 'high',
          description: 'Team leadership and mentoring capabilities',
        },
        {
          skill: 'Project Management',
          category: 'soft',
          importance: 'high',
          description: 'Planning, executing, and delivering projects',
        },
      );
    }

    suggestedSkills.push(...softSkills);

    // Limit to 10 skills and ensure we have a good mix
    const finalSkills = suggestedSkills.slice(0, 10);

    return {
      suggestedSkills: finalSkills,
      success: true,
    };
  }

  /**
   * Generate fallback responsibility suggestions based on job data
   */
  private generateFallbackResponsibilitySuggestions(
    jobData: Partial<JobFormData>,
  ): ResponsibilitySuggestionResult {
    const industry = jobData.industry?.toLowerCase() || '';
    const title = jobData.title?.toLowerCase() || '';
    const position = jobData.position?.toLowerCase() || '';
    const experienceLevel = jobData.experienceLevel?.toLowerCase() || '';

    const suggestedResponsibilities: string[] = [];

    // Technology/Software roles
    if (
      industry.includes('technology') ||
      industry.includes('information') ||
      title.includes('software') ||
      title.includes('developer') ||
      title.includes('engineer') ||
      position.includes('developer')
    ) {
      suggestedResponsibilities.push(
        'Design and develop software solutions according to business requirements',
        'Write clean, maintainable, and efficient code following best practices',
        'Participate in code reviews and provide constructive feedback to team members',
        'Collaborate with cross-functional teams including designers and product managers',
        'Debug and resolve technical issues in existing applications',
        'Contribute to technical documentation and knowledge sharing initiatives',
      );

      if (
        experienceLevel.includes('senior') ||
        experienceLevel.includes('lead')
      ) {
        suggestedResponsibilities.push(
          'Mentor junior developers and provide technical guidance',
          'Lead technical architecture decisions and system design discussions',
        );
      }
    }
    // Finance/Banking roles
    else if (industry.includes('finance') || industry.includes('banking')) {
      suggestedResponsibilities.push(
        'Analyze financial data and prepare comprehensive reports for management',
        'Monitor market trends and assess potential risks and opportunities',
        'Ensure compliance with financial regulations and industry standards',
        'Collaborate with internal teams to support business objectives',
        'Maintain accurate financial records and documentation',
        'Provide financial insights and recommendations to stakeholders',
      );

      if (title.includes('manager') || experienceLevel.includes('senior')) {
        suggestedResponsibilities.push(
          'Manage financial planning and budgeting processes',
          'Lead team initiatives and coordinate with other departments',
        );
      }
    }
    // Marketing roles
    else if (industry.includes('marketing') || title.includes('marketing')) {
      suggestedResponsibilities.push(
        'Develop and execute marketing campaigns across multiple channels',
        'Analyze campaign performance and optimize strategies based on data insights',
        'Create compelling content for various marketing materials and platforms',
        'Collaborate with sales teams to generate qualified leads',
        'Manage social media presence and engage with target audiences',
        'Monitor industry trends and competitor activities',
      );

      if (experienceLevel.includes('senior') || title.includes('manager')) {
        suggestedResponsibilities.push(
          'Lead marketing strategy development and implementation',
          'Manage marketing budget and resource allocation',
        );
      }
    }
    // HR roles
    else if (title.includes('hr') || title.includes('human resources')) {
      suggestedResponsibilities.push(
        'Manage recruitment and onboarding processes for new employees',
        'Develop and implement HR policies and procedures',
        'Handle employee relations and resolve workplace conflicts',
        'Coordinate training and professional development programs',
        'Maintain employee records and ensure compliance with labor laws',
        'Support performance management and employee evaluation processes',
      );

      if (title.includes('manager') || experienceLevel.includes('senior')) {
        suggestedResponsibilities.push(
          'Lead strategic HR initiatives and organizational development',
          'Partner with senior leadership on workforce planning and strategy',
        );
      }
    }
    // Sales roles
    else if (title.includes('sales') || position.includes('sales')) {
      suggestedResponsibilities.push(
        'Identify and pursue new business opportunities and potential clients',
        'Build and maintain strong relationships with existing customers',
        'Present products and services to prospective clients',
        'Negotiate contracts and close deals to meet sales targets',
        'Maintain accurate records of sales activities and customer interactions',
        'Collaborate with marketing and product teams to align sales strategies',
      );

      if (experienceLevel.includes('senior') || title.includes('manager')) {
        suggestedResponsibilities.push(
          'Develop sales strategies and mentor junior sales team members',
          'Analyze sales performance and identify areas for improvement',
        );
      }
    }
    // Generic responsibilities for any role
    else {
      suggestedResponsibilities.push(
        'Execute core responsibilities related to the position requirements',
        'Collaborate effectively with team members and stakeholders',
        'Maintain high standards of quality and performance in all deliverables',
        'Participate in team meetings and contribute to project planning',
        'Stay updated on industry trends and best practices',
        'Support continuous improvement initiatives within the organization',
      );

      if (experienceLevel.includes('senior') || title.includes('manager')) {
        suggestedResponsibilities.push(
          'Provide guidance and mentorship to team members',
          'Lead projects and coordinate with cross-functional teams',
        );
      }
    }

    // Limit to 8 responsibilities
    const finalResponsibilities = suggestedResponsibilities.slice(0, 8);

    return {
      suggestedResponsibilities: finalResponsibilities,
      success: true,
    };
  }
}

// Export singleton instance
export const skillSuggestionService = new SkillSuggestionService();
