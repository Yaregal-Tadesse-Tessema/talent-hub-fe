# Interactive Tutorial System

A comprehensive guided tour system for the TalentHub platform that helps new users understand the platform's features and functionality.

## Features

- **Automatic Tutorial Triggering**: Tutorials automatically show on successful login for first-time users
- **Role-Based Tutorials**: Different tutorials for employees and employers
- **Page-Specific Tutorials**: Tutorials tailored to specific pages
- **Interactive Elements**: Click actions, scrolling, and highlighting
- **Keyboard Navigation**: Arrow keys, space, and escape support
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Fully compatible with dark/light themes
- **Smooth Animations**: Powered by Framer Motion
- **Progress Tracking**: Users can skip tutorials and track completion
- **First-Time User Detection**: Automatically detects and handles first-time users

## First-Time User Functionality

### How it Works

1. **User Registration**: When a user logs in for the first time, the `isFirstTime` property is automatically set to `true`
2. **Tutorial Triggering**: Tutorials only show for users with `isFirstTime: true`
3. **Tutorial Completion**: When a user completes, skips, or closes a tutorial, `isFirstTime` is automatically set to `false` both in localStorage and the database
4. **Persistent State**: The `isFirstTime` status is stored in localStorage and the database, persisting across sessions

### User Flow

```
New User Login → isFirstTime: true → Tutorial Shows → User Completes/Skips Tutorial → isFirstTime: false → No More Tutorials
```

### Testing

Visit `/tutorial-demo` to test the tutorial system:

- View current user's `isFirstTime` status
- Reset `isFirstTime` to `true` for testing
- Manually set `isFirstTime` to `false`
- Test tutorial triggering on different pages

## Components

### Core Components

1. **TutorialContext** (`src/contexts/TutorialContext.tsx`)

   - Manages tutorial state and provides tutorial functionality
   - Handles tutorial persistence in localStorage
   - Provides methods for showing, navigating, and closing tutorials
   - Automatically updates user's `isFirstTime` status when tutorials are completed

2. **AuthContext** (`src/contexts/AuthContext.tsx`)

   - Manages user authentication and state
   - Provides `updateUserIsFirstTime()` method to update user's first-time status
   - Automatically sets `isFirstTime: true` for new users on login
   - Persists user state including `isFirstTime` in localStorage

3. **TutorialOverlay** (`src/components/ui/TutorialOverlay.tsx`)

   - Main tutorial overlay component with highlighting
   - Handles element targeting and positioning
   - Provides navigation controls and keyboard shortcuts

4. **TutorialButton** (`src/components/ui/TutorialButton.tsx`)

   - Reusable button component for triggering tutorials
   - Multiple variants: floating, inline, icon
   - Automatically shows available tutorials

5. **TutorialTrigger** (`src/components/ui/TutorialTrigger.tsx`)
   - Automatically triggers tutorials on login and page navigation
   - Handles role-based and page-specific tutorial logic

### Data Structure

#### Tutorial Definition

```typescript
interface Tutorial {
  id: string;
  name: string;
  description: string;
  steps: TutorialStep[];
  role: 'employee' | 'employer' | 'both';
  page: string; // Which page this tutorial is for
}
```

#### Tutorial Step

```typescript
interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'scroll' | 'wait';
  actionText?: string;
  skipable?: boolean;
}
```

## Persistence

Tutorial completion is stored in localStorage:

- `seenTutorials`: Array of completed tutorial IDs
- `user.isFirstTime`: Boolean indicating if user is a first-time user (stored in both localStorage and database)

## API Methods

### AuthContext Methods

```typescript
// Update user's isFirstTime status to false (updates both localStorage and database)
updateUserIsFirstTime(): Promise<void>
```

### TutorialContext Methods

```typescript
// Show a specific tutorial
showTutorial(tutorial: Tutorial): void

// Navigate to next step
nextStep(): void

// Navigate to previous step
previousStep(): void

// Close tutorial (also updates isFirstTime if applicable)
closeTutorial(): void

// Skip tutorial (also updates isFirstTime if applicable)
skipTutorial(): void

// Check if user has seen a tutorial
hasSeenTutorial(tutorialId: string): boolean

// Mark tutorial as seen
markTutorialAsSeen(tutorialId: string): void
```

## Usage

### 1. Setup

The tutorial system is already integrated into the main layout. It's automatically available throughout the app.

### 2. Adding Tutorials

Define tutorials in `src/constants/tutorials.ts`:

```typescript
export const TUTORIALS: Tutorial[] = [
  {
    id: 'my-tutorial',
    name: 'My Tutorial',
    description: 'Learn about this feature',
    role: 'employee',
    page: '/my-page',
    steps: [
      {
        id: 'step-1',
        title: 'Welcome',
        content: 'This is the first step',
        target: 'body',
        position: 'center',
        skipable: true,
      },
      {
        id: 'step-2',
        title: 'Find Element',
        content: 'This element is important',
        target: '[data-tutorial="my-element"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Click here',
      },
    ],
  },
];
```

### 3. Adding Data Attributes

Add `data-tutorial` attributes to elements you want to target:

```tsx
<input data-tutorial='search-bar' type='text' placeholder='Search...' />
```

### 4. Manual Tutorial Triggering

```tsx
import { useTutorial } from '@/contexts/TutorialContext';
import { getTutorialById } from '@/constants/tutorials';

function MyComponent() {
  const { showTutorial } = useTutorial();

  const handleStartTutorial = () => {
    const tutorial = getTutorialById('my-tutorial');
    if (tutorial) {
      showTutorial(tutorial);
    }
  };

  return <button onClick={handleStartTutorial}>Start Tutorial</button>;
}
```

### 5. Using TutorialButton Component

```tsx
import TutorialButton from '@/components/ui/TutorialButton';

// Floating help button (default)
<TutorialButton />

// Inline button with dropdown
<TutorialButton variant="inline" size="md" />

// Icon-only button
<TutorialButton variant="icon" size="lg" />

// Specific tutorial
<TutorialButton tutorialId="my-tutorial" />
```

## Tutorial Positioning

The tutorial overlay supports different positioning options:

- **top**: Tooltip appears above the target element
- **bottom**: Tooltip appears below the target element
- **left**: Tooltip appears to the left of the target element
- **right**: Tooltip appears to the right of the target element
- **center**: Tooltip appears in the center of the screen

## Keyboard Shortcuts

- **Arrow Right / Space**: Next step
- **Arrow Left**: Previous step
- **Escape**: Close tutorial
- **Click outside**: Close tutorial

## Automatic Behavior

### Login Triggering

- Tutorials automatically trigger on successful login for first-time users
- Clears previous tutorial state to ensure fresh experience
- Shows role-appropriate tutorials for the current page

### Page Navigation

- Tutorials can trigger when navigating to specific pages
- Only shows tutorials that haven't been completed
- Respects user's tutorial completion history and `isFirstTime` status

## Customization

### Styling

The tutorial overlay uses Tailwind CSS classes and can be customized by modifying the component styles.

### Animations

Animations are powered by Framer Motion and can be adjusted in the `TutorialOverlay` component.

### Content

Tutorial content is defined in the `tutorials.ts` file and can be easily modified or extended.

## Demo Page

Visit `/tutorial-demo` to see the tutorial system in action with various examples and controls.

## Best Practices

1. **Target Specific Elements**: Use precise CSS selectors for targeting
2. **Clear Instructions**: Write clear, concise tutorial content
3. **Logical Flow**: Arrange steps in a logical order
4. **Skip Options**: Allow users to skip tutorials when appropriate
5. **Mobile Consideration**: Ensure tutorials work well on mobile devices
6. **Performance**: Keep tutorial steps focused and not too lengthy

## Troubleshooting

### Tutorial Not Showing

- Check if the user's `isFirstTime` property is `true`
- Check if the tutorial is defined in `tutorials.ts`
- Verify the user role matches the tutorial role
- Ensure the current page matches the tutorial page
- Check if the tutorial has already been completed

### Element Not Highlighted

- Verify the `data-tutorial` attribute is present
- Check that the CSS selector is correct
- Ensure the element is visible when the tutorial step loads

### Positioning Issues

- Try different position values (top, bottom, left, right, center)
- Check if the target element is within the viewport
- Consider mobile responsiveness

## Future Enhancements

- [ ] Add tutorial analytics and completion tracking
- [ ] Implement tutorial branching based on user actions
- [ ] Add video tutorials support
- [ ] Create tutorial builder interface
- [ ] Add multi-language support for tutorial content
- [ ] Implement tutorial scheduling and reminders
