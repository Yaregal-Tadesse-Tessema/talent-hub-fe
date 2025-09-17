import { Job } from '@/types/job';
import { UserProfile } from '@/types/profile';
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
  console.warn('Cohere AI not available, using fallback analysis');
}

export interface SkillGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  description: string;
}

export interface LearningResource {
  title: string;
  type: 'course' | 'certification' | 'tutorial' | 'documentation';
  provider: string;
  url: string;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPaid: boolean;
}

export interface SkillsAnalysisResult {
  overallMatchPercentage: number;
  matchedSkills: string[];
  missingSkills: SkillGap[];
  learningPaths: LearningResource[];
  recommendations: string[];
  strengthAreas: string[];
  improvementAreas: string[];
}

export class SkillsAnalysisService {
  // Analyze candidate skills against job requirements
  async analyzeSkillsMatch(
    userProfile: UserProfile,
    job: Job,
  ): Promise<SkillsAnalysisResult> {
    try {
      // Try to use Cohere AI for sophisticated analysis
      if (cohere) {
        return await this.generateCohereAnalysis(userProfile, job);
      }
    } catch (error) {
      console.warn('Cohere AI not available, using fallback analysis:', error);
    }

    // Fallback to rule-based analysis
    return this.generateRuleBasedAnalysis(userProfile, job);
  }

  // Generate analysis using Cohere AI
  private async generateCohereAnalysis(
    userProfile: UserProfile,
    job: Job,
  ): Promise<SkillsAnalysisResult> {
    if (!cohere) {
      throw new Error('Cohere AI not available');
    }

    const candidateSkills = [
      ...(userProfile.technicalSkills || []),
      ...(userProfile.softSkills || []),
    ];

    const jobRequiredSkills = [
      ...(job.skill || []),
      ...(job.jobPostRequirement || []),
    ];

    const prompt = `As an AI career advisor, analyze the skills match between a candidate and a job position.

CANDIDATE PROFILE:
- Technical Skills: ${candidateSkills.join(', ')}
- Experience Level: ${userProfile.yearOfExperience} years
- Industry: ${userProfile.industry?.join(', ') || 'Not specified'}
- Education: ${userProfile.highestLevelOfEducation || 'Not specified'}
- Professional Summary: ${userProfile.professionalSummery || 'Not provided'}

JOB REQUIREMENTS:
- Position: ${job.title}
- Required Skills: ${jobRequiredSkills.join(', ')}
- Experience Level: ${job.experienceLevel}
- Industry: ${job.industry}
- Education Level: ${job.educationLevel}
- Job Description: ${job.description.substring(0, 500)}...

Please provide a detailed analysis in JSON format with the following structure:
{
  "overallMatchPercentage": number (0-100),
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": [
    {
      "skill": "skill name",
      "importance": "high|medium|low",
      "description": "why this skill is important for the role"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "strengthAreas": ["strength1", "strength2"],
  "improvementAreas": ["area1", "area2"]
}

Focus on practical, actionable insights.`;

    const response = await cohere.chat({
      model: 'command-r-08-2024',
      message: prompt,
      maxTokens: 800,
      temperature: 0.3,
    });

    const analysisText = response.text.trim();

    try {
      // Try to parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        const learningPaths = await this.generateLearningPaths(
          analysis.missingSkills || [],
        );

        return {
          ...analysis,
          learningPaths,
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse Cohere response, using fallback');
    }

    // Fallback if JSON parsing fails
    return this.generateRuleBasedAnalysis(userProfile, job);
  }

  // Generate rule-based analysis as fallback
  private generateRuleBasedAnalysis(
    userProfile: UserProfile,
    job: Job,
  ): SkillsAnalysisResult {
    const candidateSkills = [
      ...(userProfile.technicalSkills || []),
      ...(userProfile.softSkills || []),
    ].map((skill) => skill.toLowerCase());

    const jobRequiredSkills = [
      ...(job.skill || []),
      ...(job.jobPostRequirement || []),
    ];

    // Extract skills from job requirements text
    const allJobSkills = new Set<string>();
    jobRequiredSkills.forEach((req) => {
      // Extract potential skills from requirement text
      const skillKeywords = this.extractSkillsFromText(req.toLowerCase());
      skillKeywords.forEach((skill) => allJobSkills.add(skill));
    });

    const jobSkillsArray = Array.from(allJobSkills);

    // Calculate matches
    const matchedSkills: string[] = [];
    const missingSkills: SkillGap[] = [];

    jobSkillsArray.forEach((jobSkill) => {
      const isMatched = candidateSkills.some(
        (candidateSkill) =>
          candidateSkill.includes(jobSkill) ||
          jobSkill.includes(candidateSkill) ||
          this.areSkillsSimilar(candidateSkill, jobSkill),
      );

      if (isMatched) {
        matchedSkills.push(jobSkill);
      } else {
        missingSkills.push({
          skill: jobSkill,
          importance: this.determineSkillImportance(jobSkill, job),
          description: `${jobSkill} is required for this ${job.title} position`,
        });
      }
    });

    const overallMatchPercentage =
      jobSkillsArray.length > 0
        ? Math.round((matchedSkills.length / jobSkillsArray.length) * 100)
        : 0;

    const learningPaths = this.generateLearningPaths(missingSkills);

    return {
      overallMatchPercentage,
      matchedSkills,
      missingSkills,
      learningPaths,
      recommendations: this.generateRecommendations(
        overallMatchPercentage,
        missingSkills,
      ),
      strengthAreas: this.identifyStrengthAreas(userProfile, job),
      improvementAreas: missingSkills.slice(0, 3).map((gap) => gap.skill),
    };
  }

  // Extract skills from text using common patterns
  private extractSkillsFromText(text: string): string[] {
    const commonSkills = [
      // Programming languages
      'javascript',
      'python',
      'java',
      'c++',
      'c#',
      'php',
      'ruby',
      'go',
      'rust',
      'swift',
      'kotlin',
      'typescript',
      'html',
      'css',
      'sql',
      'r',
      'matlab',
      'scala',

      // Frameworks and libraries
      'react',
      'angular',
      'vue',
      'node.js',
      'express',
      'django',
      'flask',
      'spring',
      'laravel',
      'rails',
      'bootstrap',
      'jquery',
      'redux',
      'nextjs',
      'nuxt',

      // Databases
      'mysql',
      'postgresql',
      'mongodb',
      'redis',
      'elasticsearch',
      'oracle',
      'sqlite',

      // Tools and platforms
      'git',
      'docker',
      'kubernetes',
      'jenkins',
      'aws',
      'azure',
      'gcp',
      'linux',
      'windows',
      'macos',
      'jira',
      'confluence',
      'slack',
      'figma',
      'photoshop',

      // Methodologies
      'agile',
      'scrum',
      'devops',
      'ci/cd',
      'tdd',
      'bdd',
      'microservices',

      // Soft skills
      'leadership',
      'communication',
      'teamwork',
      'problem solving',
      'creativity',
      'analytical thinking',
      'project management',
      'time management',
    ];

    return commonSkills.filter((skill) => text.includes(skill));
  }

  // Check if two skills are similar
  private areSkillsSimilar(skill1: string, skill2: string): boolean {
    const similarityMap: Record<string, string[]> = {
      javascript: ['js', 'ecmascript'],
      typescript: ['ts'],
      python: ['py'],
      react: ['reactjs', 'react.js'],
      angular: ['angularjs'],
      vue: ['vuejs', 'vue.js'],
      node: ['nodejs', 'node.js'],
      postgresql: ['postgres'],
      mongodb: ['mongo'],
    };

    for (const [key, alternatives] of Object.entries(similarityMap)) {
      if (
        (skill1.includes(key) &&
          alternatives.some((alt) => skill2.includes(alt))) ||
        (skill2.includes(key) &&
          alternatives.some((alt) => skill1.includes(alt)))
      ) {
        return true;
      }
    }

    return false;
  }

  // Determine skill importance based on job context
  private determineSkillImportance(
    skill: string,
    job: Job,
  ): 'high' | 'medium' | 'low' {
    const jobTitle = job.title.toLowerCase();
    const jobDescription = job.description.toLowerCase();

    // High importance skills for different roles
    const highImportanceMap: Record<string, string[]> = {
      frontend: ['react', 'javascript', 'html', 'css', 'typescript'],
      backend: ['node.js', 'python', 'java', 'sql', 'api'],
      fullstack: ['javascript', 'react', 'node.js', 'sql'],
      data: ['python', 'sql', 'machine learning', 'statistics'],
      mobile: ['react native', 'swift', 'kotlin', 'flutter'],
    };

    for (const [role, skills] of Object.entries(highImportanceMap)) {
      if (jobTitle.includes(role) && skills.some((s) => skill.includes(s))) {
        return 'high';
      }
    }

    // Check if skill appears multiple times in job description
    const skillMentions = (jobDescription.match(new RegExp(skill, 'g')) || [])
      .length;
    if (skillMentions > 2) return 'high';
    if (skillMentions > 0) return 'medium';

    return 'low';
  }

  // Generate learning paths for missing skills
  private generateLearningPaths(missingSkills: SkillGap[]): LearningResource[] {
    const learningResources: LearningResource[] = [];

    missingSkills.forEach((gap) => {
      const skill = gap.skill.toLowerCase();

      // Add relevant learning resources based on skill
      if (skill.includes('react')) {
        learningResources.push(
          {
            title: 'React - The Complete Guide',
            type: 'course',
            provider: 'Udemy',
            url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
            duration: '48 hours',
            level: 'beginner',
            isPaid: true,
          },
          {
            title: 'React Official Documentation',
            type: 'documentation',
            provider: 'React Team',
            url: 'https://reactjs.org/docs/getting-started.html',
            level: 'intermediate',
            isPaid: false,
          },
        );
      } else if (skill.includes('python')) {
        learningResources.push(
          {
            title: 'Python for Everybody',
            type: 'course',
            provider: 'Coursera',
            url: 'https://www.coursera.org/specializations/python',
            duration: '32 hours',
            level: 'beginner',
            isPaid: true,
          },
          {
            title: 'Python.org Tutorial',
            type: 'tutorial',
            provider: 'Python Software Foundation',
            url: 'https://docs.python.org/3/tutorial/',
            level: 'beginner',
            isPaid: false,
          },
        );
      } else if (skill.includes('javascript')) {
        learningResources.push(
          {
            title: 'JavaScript: The Complete Guide',
            type: 'course',
            provider: 'Udemy',
            url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
            duration: '52 hours',
            level: 'beginner',
            isPaid: true,
          },
          {
            title: 'MDN JavaScript Guide',
            type: 'documentation',
            provider: 'Mozilla',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            level: 'intermediate',
            isPaid: false,
          },
        );
      } else if (skill.includes('sql')) {
        learningResources.push(
          {
            title: 'Complete SQL Bootcamp',
            type: 'course',
            provider: 'Udemy',
            url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/',
            duration: '9 hours',
            level: 'beginner',
            isPaid: true,
          },
          {
            title: 'W3Schools SQL Tutorial',
            type: 'tutorial',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/sql/',
            level: 'beginner',
            isPaid: false,
          },
        );
      } else {
        // Generic learning resource
        learningResources.push({
          title: `Learn ${gap.skill}`,
          type: 'course',
          provider: 'Various Platforms',
          url: `https://www.google.com/search?q=learn+${encodeURIComponent(gap.skill)}+online+course`,
          level: 'beginner',
          isPaid: false,
        });
      }
    });

    return learningResources.slice(0, 6); // Limit to 6 resources
  }

  // Generate recommendations based on analysis
  private generateRecommendations(
    matchPercentage: number,
    missingSkills: SkillGap[],
  ): string[] {
    const recommendations: string[] = [];

    if (matchPercentage >= 80) {
      recommendations.push(
        'Excellent match! You meet most of the job requirements.',
      );
      recommendations.push(
        'Focus on highlighting your matching skills in your application.',
      );
    } else if (matchPercentage >= 60) {
      recommendations.push(
        'Good match! You have a solid foundation for this role.',
      );
      recommendations.push(
        'Consider learning the missing skills to strengthen your application.',
      );
    } else if (matchPercentage >= 40) {
      recommendations.push(
        'Moderate match. You have some relevant skills but gaps exist.',
      );
      recommendations.push(
        'Focus on building the high-priority missing skills first.',
      );
    } else {
      recommendations.push('This role requires significant skill development.');
      recommendations.push(
        'Consider starting with foundational courses before applying.',
      );
    }

    const highPrioritySkills = missingSkills
      .filter((skill) => skill.importance === 'high')
      .slice(0, 2);

    if (highPrioritySkills.length > 0) {
      recommendations.push(
        `Priority skills to learn: ${highPrioritySkills.map((s) => s.skill).join(', ')}`,
      );
    }

    return recommendations;
  }

  // Identify strength areas
  private identifyStrengthAreas(userProfile: UserProfile, job: Job): string[] {
    const strengths: string[] = [];

    // Experience level match
    const userExperience = userProfile.yearOfExperience || 0;
    const jobExperienceLevel = job.experienceLevel?.toLowerCase() || '';

    if (
      (jobExperienceLevel.includes('entry') && userExperience >= 0) ||
      (jobExperienceLevel.includes('junior') && userExperience >= 1) ||
      (jobExperienceLevel.includes('mid') && userExperience >= 3) ||
      (jobExperienceLevel.includes('senior') && userExperience >= 5)
    ) {
      strengths.push('Experience Level');
    }

    // Industry match
    if (
      userProfile.industry?.some((ind) =>
        ind.toLowerCase().includes(job.industry?.toLowerCase() || ''),
      )
    ) {
      strengths.push('Industry Knowledge');
    }

    // Education match
    if (userProfile.highestLevelOfEducation && job.educationLevel) {
      const educationLevels = [
        'high school',
        'associate',
        'bachelor',
        'master',
        'phd',
      ];
      const userLevel = educationLevels.findIndex((level) =>
        userProfile.highestLevelOfEducation?.toLowerCase().includes(level),
      );
      const jobLevel = educationLevels.findIndex((level) =>
        job.educationLevel.toLowerCase().includes(level),
      );

      if (userLevel >= jobLevel) {
        strengths.push('Educational Background');
      }
    }

    return strengths;
  }
}

// Export singleton instance
export const skillsAnalysisService = new SkillsAnalysisService();
