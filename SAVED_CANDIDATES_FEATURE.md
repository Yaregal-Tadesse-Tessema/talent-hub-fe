# Saved Candidates Feature

## Overview

The Saved Candidates feature allows employers to save and manage candidate profiles they're interested in. This feature includes a dedicated tab in the employer dashboard and save functionality on the Find Candidates page.

## Features

### 1. Save Candidates

- Employers can save candidates from the Find Candidates page
- Visual feedback shows saved vs unsaved state
- Save/unsave functionality in both list view and detail modal

### 2. Saved Candidates Tab

- Dedicated tab in the employer dashboard
- Lists all saved candidates in a card format
- Search functionality to find specific saved candidates
- Edit notes and tags for each saved candidate
- Delete saved candidates

### 3. Candidate Management

- Add personal notes to saved candidates
- Tag candidates for better organization
- View full candidate details
- Remove candidates from saved list

## Implementation Details

### Files Created/Modified

#### New Files:

- `src/services/savedCandidates.service.ts` - Service for CRUD operations on saved candidates
- `src/app/dashboard/components/employer/SavedCandidatesTab.tsx` - Main component for the saved candidates tab

#### Modified Files:

- `src/app/dashboard/components/EmployerDashboard.tsx` - Added SavedCandidatesTab import and routing
- `src/app/find-candidates/page.tsx` - Added save functionality to candidate cards
- `src/app/find-candidates/CandidateDetailModal.tsx` - Added save functionality to modal

### API Endpoints Used

- `GET /saved-candidates` - Fetch saved candidates for an employer
- `POST /saved-candidates` - Save a new candidate
- `PUT /saved-candidates/:id` - Update saved candidate notes/tags
- `DELETE /saved-candidates/:id` - Remove saved candidate

### Data Structure

#### SavedCandidate Interface:

```typescript
interface SavedCandidate {
  id: string;
  candidateId: string;
  employerId: string;
  notes?: string;
  tags?: string[];
  savedAt: string;
  candidate: JobSeekerProfile;
}
```

## Usage

### For Employers:

1. Navigate to Find Candidates page
2. Click the bookmark icon on any candidate card to save them
3. Access saved candidates from the employer dashboard
4. Use the "Saved Candidate" tab to manage your saved candidates
5. Add notes and tags to organize candidates
6. Search through saved candidates
7. Remove candidates from saved list when no longer needed

### Features in Detail:

#### Save/Unsave Candidates:

- Visual feedback with filled/unfilled bookmark icons
- Immediate state updates
- Error handling for failed operations

#### Saved Candidates Tab:

- Responsive design with mobile-friendly layout
- Search functionality
- Edit modal for notes and tags
- Delete confirmation
- Loading states and error handling

#### Notes and Tags:

- Notes: Free text for personal observations
- Tags: Comma-separated values for categorization
- Both are optional and can be edited later

## Technical Notes

### State Management:

- Uses React hooks for local state management
- Maintains saved candidates state in the find candidates page
- Syncs state between list view and modal

### Error Handling:

- API error handling with user-friendly messages
- Loading states for better UX
- Graceful fallbacks for failed operations

### Responsive Design:

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions

## Future Enhancements

Potential improvements for the saved candidates feature:

1. **Bulk Operations**: Select multiple candidates for bulk actions
2. **Advanced Filtering**: Filter saved candidates by tags, notes, or other criteria
3. **Export Functionality**: Export saved candidates list
4. **Sharing**: Share saved candidates with team members
5. **Analytics**: Track which candidates are most frequently saved
6. **Integration**: Connect with other hiring tools and platforms

## Testing

To test the feature:

1. Start the development server: `npm run dev`
2. Log in as an employer
3. Navigate to Find Candidates page
4. Save some candidates using the bookmark button
5. Check the Saved Candidates tab in the dashboard
6. Test search, edit, and delete functionality

## Dependencies

- React Icons (FiBookmark, FiSearch, FiEdit2, FiTrash2, FiEye, FiX)
- Existing auth context and API configuration
- Tailwind CSS for styling
