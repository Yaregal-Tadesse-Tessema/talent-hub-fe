# AI Skills Analysis Feature

## Overview

The AI Skills Analysis feature provides intelligent comparison between a candidate's skills and job requirements, offering personalized learning recommendations to improve job application success rates.

## Features

### 1. Skills Comparison Card

- **Location**: Right sidebar of job detail pages (above Job Overview)
- **Visibility**: Only shown to logged-in users
- **Key Elements**:
  - Overall match percentage with color-coded indicators
  - Quick stats showing matched vs missing skills
  - Teaser information about strengths and areas for improvement
  - Attractive gradient design with animations

### 2. Detailed Analysis Modal

- **Triggered by**: Clicking the Skills Comparison Card
- **Three Main Tabs**:
  - **Overview**: Match percentage, quick stats, AI recommendations, and strength areas
  - **Skills Analysis**: Detailed breakdown of matched and missing skills with priority levels
  - **Learning Path**: Curated learning resources with links to courses, tutorials, and certifications

### 3. AI-Powered Analysis

- **Primary**: Uses Cohere AI for sophisticated analysis (when API key is configured)
- **Fallback**: Rule-based analysis system for reliable functionality
- **Analysis includes**:
  - Skill matching with fuzzy logic
  - Priority assessment (high/medium/low importance)
  - Personalized recommendations
  - Learning resource suggestions

## Implementation Details

### Components

- `SkillsComparisonCard.tsx` - Main card component in sidebar
- `SkillsAnalysisModal.tsx` - Detailed analysis popup modal
- `skillsAnalysisService.ts` - AI service for skills analysis

### Data Requirements

The feature uses the following user profile data:

- `technicalSkills`: Array of technical skills
- `softSkills`: Array of soft skills
- `yearOfExperience`: Years of professional experience
- `industry`: Industry preferences/background
- `highestLevelOfEducation`: Educational background
- `professionalSummery`: Professional summary text

### Configuration

#### Cohere AI Setup (Optional)

```bash
# Add to your environment file
NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key_here
```

If no API key is provided, the system automatically falls back to rule-based analysis.

## User Experience Flow

1. **User visits job detail page** while logged in
2. **Skills Analysis Card appears** in the right sidebar
3. **AI analyzes** user's profile against job requirements in the background
4. **Card displays** match percentage and key insights
5. **User clicks card** to open detailed modal
6. **Modal provides** comprehensive analysis with learning recommendations
7. **User can access** external learning resources via provided links

## Match Scoring System

### Color Coding

- **Green (80%+)**: Excellent Match - Ready to apply
- **Blue (60-79%)**: Good Match - Minor gaps to address
- **Orange (40-59%)**: Moderate Match - Some skill development needed
- **Red (<40%)**: Needs Development - Significant learning required

### Skill Importance Levels

- **High**: Critical skills for the role (highlighted in red)
- **Medium**: Important but not critical (highlighted in orange)
- **Low**: Nice-to-have skills (highlighted in gray)

## Learning Resources

The system provides curated learning resources including:

- **Courses**: Structured online courses (Udemy, Coursera, etc.)
- **Certifications**: Professional certifications
- **Tutorials**: Free tutorials and guides
- **Documentation**: Official documentation and references

Each resource includes:

- Provider information
- Duration estimates
- Skill level (beginner/intermediate/advanced)
- Cost information (free/paid)
- Direct links to resources

## Benefits

### For Candidates

- **Clear visibility** into skill gaps
- **Actionable learning paths** for career development
- **Increased confidence** in job applications
- **Time-saving** resource curation

### For the Platform

- **Enhanced user engagement** through personalized insights
- **Improved job application quality** through better preparation
- **Differentiation** from competitors through AI features
- **Data-driven** career development support

## Future Enhancements

- Integration with more AI providers
- Skill trend analysis
- Progress tracking for learning paths
- Integration with learning platforms
- Employer-specific skill requirements
- Industry benchmarking
