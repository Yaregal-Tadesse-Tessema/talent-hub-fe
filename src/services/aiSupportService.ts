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
  console.warn('Cohere AI not available, using knowledge base fallback');
}

export interface SupportQuery {
  id: string;
  question: string;
  category: string;
  response: string;
  keywords: string[];
  confidence: number;
}

export interface AISupportResponse {
  answer: string;
  confidence: number;
  suggestedActions?: string[];
  relatedTopics?: string[];
  shouldEscalate?: boolean;
}

// Knowledge base for common queries
const SUPPORT_KNOWLEDGE_BASE: SupportQuery[] = [
  {
    id: 'job-posting-1',
    question: 'How do I post a job?',
    category: 'job-posting',
    response: `To post a job on TalentHub, follow these steps:

1. **Log in to your employer account**
2. **Navigate to your dashboard** and click "Post a Job"
3. **Fill out the job details form** including:
   - Job title and description
   - Required skills and experience
   - Location and work type (remote/hybrid/onsite)
   - Salary range (optional)
   - Application deadline
4. **Review your job posting** and make any necessary edits
5. **Submit for review** - your job will be published within 24 hours

**Pro Tips:**
- Be specific about requirements to attract the right candidates
- Include company culture information to stand out
- Set realistic application deadlines`,
    keywords: ['post job', 'create job', 'job posting', 'hire', 'recruit'],
    confidence: 0.95,
  },
  {
    id: 'account-management-1',
    question: 'How do I update my profile?',
    category: 'account-management',
    response: `To update your profile on TalentHub:

1. **Go to your dashboard**
2. **Click on your profile picture** in the top right corner
3. **Select "Edit Profile"** from the dropdown menu
4. **Update your information** including:
   - Personal details (name, email, phone)
   - Professional summary
   - Skills and experience
   - Profile picture
   - Social media links
5. **Click "Save Changes"** to update your profile

**Note:** Profile updates are reflected immediately and visible to potential employers or candidates.`,
    keywords: [
      'update profile',
      'edit profile',
      'change profile',
      'profile settings',
    ],
    confidence: 0.92,
  },
  {
    id: 'billing-1',
    question: 'What are your pricing plans?',
    category: 'billing',
    response: `TalentHub offers flexible pricing plans to meet your needs:

**Free Plan:**
- Basic job posting (up to 3 active jobs)
- Candidate search with basic filters
- Email notifications
- Standard support

**Professional Plan: $29/month**
- Unlimited job postings
- Advanced candidate search and filters
- Analytics and insights
- Priority support
- Custom branding
- Bulk candidate messaging

**Enterprise Plan: Custom pricing**
- All Professional features
- Dedicated account manager
- Custom integrations
- Advanced analytics
- White-label options
- API access

**Payment Methods:** Credit cards, PayPal, bank transfers
**Billing Cycle:** Monthly or annual (save 20% with annual billing)`,
    keywords: [
      'pricing',
      'plans',
      'cost',
      'billing',
      'subscription',
      'payment',
    ],
    confidence: 0.94,
  },
  {
    id: 'candidate-search-1',
    question: 'How do I find candidates?',
    category: 'candidate-search',
    response: `Find the perfect candidates using TalentHub's advanced search:

**Search Methods:**
1. **Keyword Search** - Search by job title, skills, or keywords
2. **Advanced Filters** - Filter by experience, location, education, availability
3. **Saved Searches** - Save your search criteria for quick access
4. **Job Posting** - Post a job and let candidates come to you

**Search Tips:**
- Use specific skill keywords (e.g., "React.js" instead of "JavaScript")
- Filter by experience level to find the right fit
- Check candidate availability and location preferences
- Review candidate profiles and portfolios before contacting

**Contacting Candidates:**
- Send direct messages through the platform
- Schedule interviews using our built-in calendar
- Save candidates to your shortlist for later review`,
    keywords: [
      'find candidates',
      'search candidates',
      'hiring',
      'recruitment',
      'talent search',
    ],
    confidence: 0.93,
  },
  {
    id: 'technical-support-1',
    question: 'I forgot my password',
    category: 'technical-support',
    response: `No worries! Here's how to reset your password:

**Password Reset Steps:**
1. **Go to the login page**
2. **Click "Forgot Password?"** below the login form
3. **Enter your email address** associated with your account
4. **Check your email** for password reset instructions
5. **Click the reset link** in the email
6. **Enter your new password** (minimum 8 characters)
7. **Confirm your new password** and click "Reset Password"

**Security Tips:**
- Use a strong, unique password
- Enable two-factor authentication for extra security
- Never share your password with anyone

**Still having trouble?**
Contact our support team at support@talenthub.com or call +1-202-555-0178`,
    keywords: [
      'forgot password',
      'reset password',
      'password reset',
      'login problem',
    ],
    confidence: 0.96,
  },
  {
    id: 'applications-1',
    question: 'How do I manage applications?',
    category: 'applications',
    response: `Manage your job applications efficiently:

**Viewing Applications:**
1. **Go to your dashboard**
2. **Click "Applications"** in the sidebar
3. **Select a job** to view its applications
4. **Filter applications** by status, date, or candidate details

**Application Statuses:**
- **New** - Recently received applications
- **In Review** - Applications you're currently reviewing
- **Shortlisted** - Candidates you want to interview
- **Interviewed** - Candidates you've spoken with
- **Hired** - Successful candidates
- **Rejected** - Applications you've declined

**Managing Applications:**
- **Update status** to track progress
- **Send messages** to candidates directly
- **Schedule interviews** using our calendar integration
- **Export data** for external tracking
- **Archive** old applications

**Best Practices:**
- Respond to applications within 48 hours
- Provide feedback to rejected candidates
- Keep detailed notes on each candidate`,
    keywords: [
      'applications',
      'manage applications',
      'job applications',
      'candidates',
    ],
    confidence: 0.91,
  },
];

// Enhanced AI response generation
export class AISupportService {
  private knowledgeBase: SupportQuery[] = SUPPORT_KNOWLEDGE_BASE;

  // Find the best matching response from knowledge base
  private findBestMatch(query: string): SupportQuery | null {
    const lowerQuery = query.toLowerCase();
    let bestMatch: SupportQuery | null = null;
    let bestScore = 0;

    for (const item of this.knowledgeBase) {
      let score = 0;

      // Check keyword matches
      for (const keyword of item.keywords) {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          score += 2;
        }
      }

      // Check question similarity
      if (
        lowerQuery.includes(
          item.question
            .toLowerCase()
            .replace('how do i ', '')
            .replace('what are ', ''),
        )
      ) {
        score += 3;
      }

      // Check category relevance
      const categoryKeywords = {
        'job-posting': ['post', 'create', 'job', 'hire', 'recruit'],
        'account-management': ['profile', 'account', 'settings', 'update'],
        billing: ['pricing', 'payment', 'billing', 'cost', 'plan'],
        'candidate-search': ['find', 'search', 'candidate', 'talent'],
        'technical-support': ['password', 'login', 'reset', 'problem', 'issue'],
        applications: ['application', 'manage', 'candidate', 'status'],
      };

      const categoryWords =
        categoryKeywords[item.category as keyof typeof categoryKeywords] || [];
      for (const word of categoryWords) {
        if (lowerQuery.includes(word)) {
          score += 1;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    return bestScore >= 2 ? bestMatch : null;
  }

  // Generate AI response using Cohere (if available) or fallback to knowledge base
  async generateResponse(userQuery: string): Promise<AISupportResponse> {
    try {
      // Try to use Cohere AI for more sophisticated responses
      if (cohere) {
        return await this.generateCohereResponse(userQuery);
      }
    } catch (error) {
      console.warn(
        'Cohere AI not available, using knowledge base fallback:',
        error,
      );
    }

    // Fallback to knowledge base
    return this.generateKnowledgeBaseResponse(userQuery);
  }

  // Generate response using Cohere AI
  private async generateCohereResponse(
    userQuery: string,
  ): Promise<AISupportResponse> {
    // Check if cohere is available
    if (!cohere) {
      throw new Error('Cohere AI not available');
    }

    const prompt = `You are a helpful customer support assistant for TalentHub, a job posting and candidate search platform. 

Context: TalentHub helps employers post jobs and find candidates, and helps job seekers find opportunities.

User Question: "${userQuery}"

Please provide a helpful, accurate response. If you're not sure about something specific to TalentHub, suggest they contact human support.

Response:`;

    const response = await cohere.chat({
      model: 'command-r-08-2024',
      message: prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    const answer = response.text.trim();

    return {
      answer,
      confidence: 0.85,
      suggestedActions: this.getSuggestedActions(userQuery),
      relatedTopics: this.getRelatedTopics(userQuery),
      shouldEscalate: this.shouldEscalateToHuman(userQuery),
    };
  }

  // Generate response using knowledge base
  private generateKnowledgeBaseResponse(userQuery: string): AISupportResponse {
    const bestMatch = this.findBestMatch(userQuery);

    if (bestMatch) {
      return {
        answer: bestMatch.response,
        confidence: bestMatch.confidence,
        suggestedActions: this.getSuggestedActions(userQuery),
        relatedTopics: this.getRelatedTopics(userQuery),
        shouldEscalate: false,
      };
    }

    // Default response for unrecognized queries
    return {
      answer: `I'm sorry, I don't have specific information about that. However, I can help you with:

• Job posting and management
• Finding and contacting candidates
• Account settings and profile updates
• Billing and pricing information
• Technical support and login issues
• Application management

Could you please rephrase your question or ask about one of these topics? For more specific assistance, you can contact our human support team at support@talenthub.com or call +1-202-555-0178.`,
      confidence: 0.3,
      suggestedActions: ['Contact human support'],
      relatedTopics: ['General help', 'Contact support'],
      shouldEscalate: true,
    };
  }

  // Get suggested actions based on query
  private getSuggestedActions(query: string): string[] {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('post') || lowerQuery.includes('job')) {
      return ['Go to Post Job page', 'View job posting guide'];
    }
    if (lowerQuery.includes('candidate') || lowerQuery.includes('search')) {
      return ['Search candidates', 'View search tips'];
    }
    if (lowerQuery.includes('profile') || lowerQuery.includes('account')) {
      return ['Go to account settings', 'Update profile'];
    }
    if (lowerQuery.includes('billing') || lowerQuery.includes('payment')) {
      return ['View billing settings', 'Contact billing team'];
    }
    if (lowerQuery.includes('password') || lowerQuery.includes('login')) {
      return ['Reset password', 'Contact technical support'];
    }

    return ['Browse help center', 'Contact support'];
  }

  // Get related topics
  private getRelatedTopics(query: string): string[] {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('post') || lowerQuery.includes('job')) {
      return [
        'Job posting best practices',
        'Pricing plans',
        'Application management',
      ];
    }
    if (lowerQuery.includes('candidate') || lowerQuery.includes('search')) {
      return [
        'Advanced search filters',
        'Contacting candidates',
        'Interview scheduling',
      ];
    }
    if (lowerQuery.includes('profile') || lowerQuery.includes('account')) {
      return ['Account security', 'Profile optimization', 'Privacy settings'];
    }
    if (lowerQuery.includes('billing') || lowerQuery.includes('payment')) {
      return [
        'Subscription management',
        'Payment methods',
        'Invoice downloads',
      ];
    }

    return ['Getting started guide', 'Best practices', 'Video tutorials'];
  }

  // Determine if query should be escalated to human support
  private shouldEscalateToHuman(query: string): boolean {
    const escalationKeywords = [
      'complaint',
      'refund',
      'legal',
      'urgent',
      'emergency',
      'broken',
      'not working',
      'error',
      'bug',
      'hacked',
      'security',
      'fraud',
    ];

    const lowerQuery = query.toLowerCase();
    return escalationKeywords.some((keyword) => lowerQuery.includes(keyword));
  }

  // Add new knowledge base entry
  addKnowledgeEntry(entry: Omit<SupportQuery, 'id'>): void {
    const newEntry: SupportQuery = {
      ...entry,
      id: `custom-${Date.now()}`,
    };
    this.knowledgeBase.push(newEntry);
  }

  // Get all knowledge base entries
  getKnowledgeBase(): SupportQuery[] {
    return [...this.knowledgeBase];
  }

  // Search knowledge base
  searchKnowledgeBase(query: string): SupportQuery[] {
    const lowerQuery = query.toLowerCase();
    return this.knowledgeBase.filter(
      (entry) =>
        entry.question.toLowerCase().includes(lowerQuery) ||
        entry.keywords.some((keyword) =>
          keyword.toLowerCase().includes(lowerQuery),
        ),
    );
  }
}

// Export singleton instance
export const aiSupportService = new AISupportService();
