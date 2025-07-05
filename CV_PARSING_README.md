# CV Parsing with Cohere AI

This feature allows users to upload their CV/resume text and automatically extract structured information using Cohere AI, then map it to the user profile model.

## Features

- **AI-Powered CV Parsing**: Uses Cohere AI to extract structured data from CV text
- **Optimized Performance**: Fast parsing with text optimization and timeout handling
- **Engaging Loading Animation**: Multi-step progress animation to keep users entertained
- **Multi-step Process**: Upload → Parse → Review → Edit → Save
- **Comprehensive Field Mapping**: Extracts all relevant user profile fields
- **User-Friendly Interface**: Clean, intuitive UI for reviewing and editing parsed data
- **Integration Ready**: Easy to integrate into existing profile pages

## How It Works

### 1. CV Text Input

Users paste their CV/resume text into a textarea. The system accepts plain text format.

### 2. Text Optimization

Before sending to AI, the text is optimized for faster processing:

- Normalizes whitespace and removes extra newlines
- Limits text length to 3000 characters for optimal performance
- Reduces processing time while maintaining accuracy

### 3. AI Parsing with Loading Animation

The optimized text is sent to Cohere AI with a streamlined prompt while showing an engaging loading animation:

- **Step-by-step progress**: Shows 7 different parsing stages
- **Visual feedback**: Animated icons and progress indicators
- **Entertainment**: Fun facts and smooth transitions
- **Timeout protection**: 30-second timeout prevents hanging requests

The AI extracts:

- Personal information (name, email, phone, etc.)
- Professional details (experience, education, skills)
- Categorizes skills as technical or soft skills
- Parses work experience and education history
- Extracts contact information and social media links

### 4. Data Review

Users can review the extracted information in a structured format, showing:

- Basic information (name, contact details)
- Professional information (headline, experience, education)
- Skills (technical and soft skills)
- Professional summary
- Experience and education summaries

### 5. Data Editing

Users can edit any extracted information before saving to their profile.

### 6. Profile Update

The parsed and edited data is merged with existing profile information and saved.

## API Key Setup

Make sure you have the Cohere API key in your environment variables:

```env
NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key_here
```

## Usage

### Basic Usage

```typescript
import { parseCVFromText } from '@/services/cvParsingService';

// Parse CV text
const parsedData = await parseCVFromText(cvText);

// Map to UserProfile
const userProfile = mapParsedDataToUserProfile(parsedData, userId);
```

### Component Integration

```typescript
import CVParserModal from '@/components/cv/CVParserModal';

// In your component
const [showCVParser, setShowCVParser] = useState(false);

const handleCVParserSave = async (parsedProfile: UserProfile) => {
  // Handle the parsed profile data
  await updateProfile(parsedProfile);
};

// In your JSX
<CVParserModal
  isOpen={showCVParser}
  onClose={() => setShowCVParser(false)}
  onSave={handleCVParserSave}
  userId={currentUserId}
/>
```

## Extracted Fields

The CV parser extracts the following fields:

### Personal Information

- `firstName`, `middleName`, `lastName`
- `email`, `phone`
- `gender`, `birthDate`
- `address` (street, city, state, postalCode, country)

### Professional Information

- `profileHeadLine` - Professional title/headline
- `yearOfExperience` - Total years of work experience
- `highestLevelOfEducation` - Education level
- `salaryExpectations` - Expected salary
- `industry` - Industries worked in
- `preferredJobLocation` - Preferred job locations

### Skills

- `technicalSkills` - Technical skills and technologies
- `softSkills` - Soft skills and competencies

### Content

- `professionalSummery` - Professional summary/objective
- `coverLetter` - Cover letter content
- `linkedinUrl`, `portfolioUrl` - Social media links

### Experience & Education

- `experiences` - Work experience (position, company, dates, description)
- `educations` - Education history (degree, institution, dates, description)
- `socialMediaLinks` - Various social media profiles

## Performance Optimizations

The CV parsing service has been optimized for speed and user experience:

### Text Processing Optimizations

- **Text normalization**: Removes extra whitespace and newlines
- **Length limiting**: Truncates text to 3000 characters for faster processing
- **Streamlined prompt**: Simplified prompt structure reduces token usage

### API Optimizations

- **Reduced maxTokens**: From 2000 to 1000 tokens for faster response
- **Lower temperature**: 0.05 for more consistent and faster parsing
- **Timeout protection**: 30-second timeout prevents hanging requests
- **Promise.race**: Ensures requests don't hang indefinitely

### User Experience Optimizations

- **Loading animation**: 7-step progress animation keeps users engaged
- **Step timing**: Different durations for each step create realistic progression
- **Visual feedback**: Animated icons and progress indicators
- **Fun facts**: Educational content during loading

## Prompt Engineering

The Cohere AI prompt is carefully designed to:

1. **Extract Only Explicit Information**: Only extract information that is clearly stated in the CV
2. **Handle Missing Data**: Use appropriate defaults for missing information
3. **Format Dates Correctly**: Use YYYY-MM-DD for birth dates, YYYY-MM for experience/education
4. **Categorize Skills**: Distinguish between technical and soft skills
5. **Structure Complex Data**: Handle multiple experiences and educations
6. **Return Valid JSON**: Ensure the response is parseable JSON

## Error Handling

The service includes comprehensive error handling for:

- Invalid CV text
- API failures
- JSON parsing errors
- Missing required fields
- Network issues

## Future Enhancements

### PDF Support

Currently, the service only accepts text input. Future versions could include:

- PDF file upload and text extraction
- Image-based CV parsing (OCR)
- Multiple file format support

### Enhanced Parsing

- Better skill categorization
- Industry detection
- Salary range parsing
- Location normalization
- Company name standardization

### Integration Features

- Direct file upload from profile page
- Batch processing for multiple CVs
- Export parsed data in various formats
- Integration with job matching algorithms

## Troubleshooting

### Common Issues

1. **API Key Not Found**

   - Ensure `NEXT_PUBLIC_COHERE_API_KEY` is set in your environment variables
   - Check that the key is valid and has sufficient credits

2. **Parsing Fails**

   - Ensure the CV text is clear and well-formatted
   - Check that the text contains sufficient information
   - Verify the text is not corrupted or incomplete

3. **Incorrect Data Extraction**

   - Review the CV text for clarity
   - Check that information is explicitly stated
   - Consider editing the extracted data manually

4. **Performance Issues**
   - Large CVs may take longer to parse
   - Consider breaking very large CVs into sections
   - Monitor API usage and rate limits

## Security Considerations

- CV text is sent to Cohere AI for processing
- Ensure your privacy policy covers AI processing
- Consider data retention policies for parsed CVs
- Implement proper access controls for CV data

## Dependencies

- `cohere-ai` - For AI-powered text parsing
- React components for UI
- TypeScript for type safety
- Existing UI components (Button, Input, etc.)
