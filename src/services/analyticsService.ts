import { trackEvent } from '@/lib/posthog';

// Event names for consistent tracking
export const ANALYTICS_EVENTS = {
  // Authentication Events
  USER_LOGIN: 'User Login',
  USER_LOGOUT: 'User Logout',
  USER_REGISTER: 'User Register',
  USER_LOGIN_FAILED: 'User Login Failed',

  // Job Search Events
  JOB_SEARCH: 'Job Search',
  JOB_VIEW: 'Job View',
  JOB_APPLY: 'Job Apply',
  JOB_SAVE: 'Job Save',
  JOB_UNSAVE: 'Job Unsave',
  JOB_SHARE: 'Job Share',

  // CV Builder Events
  CV_BUILDER_START: 'CV Builder Start',
  CV_BUILDER_STEP_COMPLETE: 'CV Builder Step Complete',
  CV_BUILDER_FINISH: 'CV Builder Finish',
  CV_DOWNLOAD: 'CV Download',
  CV_TEMPLATE_SELECT: 'CV Template Select',
  CV_PARSE_UPLOAD: 'CV Parse Upload',
  CV_PARSE_SUCCESS: 'CV Parse Success',

  // Skills Analysis Events
  SKILLS_ANALYSIS_VIEW: 'Skills Analysis View',
  SKILLS_ANALYSIS_DETAILS: 'Skills Analysis Details',
  LEARNING_RESOURCE_CLICK: 'Learning Resource Click',

  // Employer Events
  JOB_POST_CREATE: 'Job Post Create',
  JOB_POST_PUBLISH: 'Job Post Publish',
  JOB_POST_EDIT: 'Job Post Edit',
  JOB_POST_DELETE: 'Job Post Delete',
  CANDIDATE_VIEW: 'Candidate View',
  CANDIDATE_SAVE: 'Candidate Save',
  APPLICATION_REVIEW: 'Application Review',

  // Tutorial Events
  TUTORIAL_START: 'Tutorial Start',
  TUTORIAL_STEP_COMPLETE: 'Tutorial Step Complete',
  TUTORIAL_SKIP: 'Tutorial Skip',
  TUTORIAL_FINISH: 'Tutorial Finish',

  // Navigation Events
  PAGE_VIEW: 'Page View',
  SEARCH_FILTER: 'Search Filter',
  SORT_CHANGE: 'Sort Change',

  // Support Events
  SUPPORT_CHAT_START: 'Support Chat Start',
  SUPPORT_CHAT_MESSAGE: 'Support Chat Message',
  SUPPORT_KNOWLEDGE_BASE_VIEW: 'Support Knowledge Base View',

  // Feature Usage
  FEATURE_FLAG_VIEW: 'Feature Flag View',
  DARK_MODE_TOGGLE: 'Dark Mode Toggle',
  NOTIFICATION_CLICK: 'Notification Click',
} as const;

// Analytics service class
export class AnalyticsService {
  // Authentication tracking
  static trackLogin(userRole: 'employer' | 'employee', method = 'email') {
    trackEvent(ANALYTICS_EVENTS.USER_LOGIN, {
      user_role: userRole,
      login_method: method,
      timestamp: new Date().toISOString(),
    });
  }

  static trackLogout(userRole: 'employer' | 'employee') {
    trackEvent(ANALYTICS_EVENTS.USER_LOGOUT, {
      user_role: userRole,
      timestamp: new Date().toISOString(),
    });
  }

  static trackLoginFailed(email: string, reason: string) {
    trackEvent(ANALYTICS_EVENTS.USER_LOGIN_FAILED, {
      email_domain: email.split('@')[1],
      failure_reason: reason,
      timestamp: new Date().toISOString(),
    });
  }

  // Job search tracking
  static trackJobSearch(
    searchTerm: string,
    filters: Record<string, any>,
    resultCount: number,
  ) {
    trackEvent(ANALYTICS_EVENTS.JOB_SEARCH, {
      search_term: searchTerm,
      filters: filters,
      result_count: resultCount,
      timestamp: new Date().toISOString(),
    });
  }

  static trackJobView(jobId: string, jobTitle: string, source = 'search') {
    trackEvent(ANALYTICS_EVENTS.JOB_VIEW, {
      job_id: jobId,
      job_title: jobTitle,
      source: source,
      timestamp: new Date().toISOString(),
    });
  }

  static trackJobApply(
    jobId: string,
    jobTitle: string,
    applicationMethod = 'direct',
  ) {
    trackEvent(ANALYTICS_EVENTS.JOB_APPLY, {
      job_id: jobId,
      job_title: jobTitle,
      application_method: applicationMethod,
      timestamp: new Date().toISOString(),
    });
  }

  static trackJobSave(
    jobId: string,
    jobTitle: string,
    action: 'save' | 'unsave',
  ) {
    const eventName =
      action === 'save'
        ? ANALYTICS_EVENTS.JOB_SAVE
        : ANALYTICS_EVENTS.JOB_UNSAVE;
    trackEvent(eventName, {
      job_id: jobId,
      job_title: jobTitle,
      timestamp: new Date().toISOString(),
    });
  }

  // CV Builder tracking
  static trackCVBuilderStart(template?: string) {
    trackEvent(ANALYTICS_EVENTS.CV_BUILDER_START, {
      template: template,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCVBuilderStepComplete(step: string, timeSpent: number) {
    trackEvent(ANALYTICS_EVENTS.CV_BUILDER_STEP_COMPLETE, {
      step: step,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCVBuilderFinish(
    template: string,
    totalTime: number,
    stepsCompleted: number,
  ) {
    trackEvent(ANALYTICS_EVENTS.CV_BUILDER_FINISH, {
      template: template,
      total_time_seconds: totalTime,
      steps_completed: stepsCompleted,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCVDownload(template: string, format = 'pdf') {
    trackEvent(ANALYTICS_EVENTS.CV_DOWNLOAD, {
      template: template,
      format: format,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCVTemplateSelect(template: string) {
    trackEvent(ANALYTICS_EVENTS.CV_TEMPLATE_SELECT, {
      template: template,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCVParseUpload(fileSize: number, fileName: string) {
    trackEvent(ANALYTICS_EVENTS.CV_PARSE_UPLOAD, {
      file_size_kb: Math.round(fileSize / 1024),
      file_name: fileName,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCVParseSuccess(extractedFields: string[], confidence: number) {
    trackEvent(ANALYTICS_EVENTS.CV_PARSE_SUCCESS, {
      extracted_fields: extractedFields,
      confidence_score: confidence,
      timestamp: new Date().toISOString(),
    });
  }

  // Skills Analysis tracking
  static trackSkillsAnalysisView(jobId: string, matchPercentage: number) {
    trackEvent(ANALYTICS_EVENTS.SKILLS_ANALYSIS_VIEW, {
      job_id: jobId,
      match_percentage: matchPercentage,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSkillsAnalysisDetails(
    jobId: string,
    missingSkills: string[],
    matchedSkills: string[],
  ) {
    trackEvent(ANALYTICS_EVENTS.SKILLS_ANALYSIS_DETAILS, {
      job_id: jobId,
      missing_skills_count: missingSkills.length,
      matched_skills_count: matchedSkills.length,
      timestamp: new Date().toISOString(),
    });
  }

  static trackLearningResourceClick(
    resourceType: string,
    resourceUrl: string,
    skill: string,
  ) {
    trackEvent(ANALYTICS_EVENTS.LEARNING_RESOURCE_CLICK, {
      resource_type: resourceType,
      resource_url: resourceUrl,
      skill: skill,
      timestamp: new Date().toISOString(),
    });
  }

  // Employer tracking
  static trackJobPostCreate(
    jobTitle: string,
    industry: string,
    employmentType: string,
  ) {
    trackEvent(ANALYTICS_EVENTS.JOB_POST_CREATE, {
      job_title: jobTitle,
      industry: industry,
      employment_type: employmentType,
      timestamp: new Date().toISOString(),
    });
  }

  static trackJobPostPublish(
    jobId: string,
    jobTitle: string,
    requirements: string[],
  ) {
    trackEvent(ANALYTICS_EVENTS.JOB_POST_PUBLISH, {
      job_id: jobId,
      job_title: jobTitle,
      requirements_count: requirements.length,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCandidateView(candidateId: string, source = 'search') {
    trackEvent(ANALYTICS_EVENTS.CANDIDATE_VIEW, {
      candidate_id: candidateId,
      source: source,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCandidateSave(candidateId: string, action: 'save' | 'unsave') {
    trackEvent(ANALYTICS_EVENTS.CANDIDATE_SAVE, {
      candidate_id: candidateId,
      action: action,
      timestamp: new Date().toISOString(),
    });
  }

  static trackApplicationReview(
    applicationId: string,
    action: 'view' | 'accept' | 'reject',
  ) {
    trackEvent(ANALYTICS_EVENTS.APPLICATION_REVIEW, {
      application_id: applicationId,
      action: action,
      timestamp: new Date().toISOString(),
    });
  }

  // Tutorial tracking
  static trackTutorialStart(tutorialType: string, userRole: string) {
    trackEvent(ANALYTICS_EVENTS.TUTORIAL_START, {
      tutorial_type: tutorialType,
      user_role: userRole,
      timestamp: new Date().toISOString(),
    });
  }

  static trackTutorialStepComplete(
    tutorialType: string,
    step: string,
    stepNumber: number,
  ) {
    trackEvent(ANALYTICS_EVENTS.TUTORIAL_STEP_COMPLETE, {
      tutorial_type: tutorialType,
      step: step,
      step_number: stepNumber,
      timestamp: new Date().toISOString(),
    });
  }

  static trackTutorialSkip(
    tutorialType: string,
    step: string,
    reason?: string,
  ) {
    trackEvent(ANALYTICS_EVENTS.TUTORIAL_SKIP, {
      tutorial_type: tutorialType,
      step: step,
      reason: reason,
      timestamp: new Date().toISOString(),
    });
  }

  static trackTutorialFinish(
    tutorialType: string,
    totalSteps: number,
    timeSpent: number,
  ) {
    trackEvent(ANALYTICS_EVENTS.TUTORIAL_FINISH, {
      tutorial_type: tutorialType,
      total_steps: totalSteps,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString(),
    });
  }

  // Support tracking
  static trackSupportChatStart(chatType = 'general') {
    trackEvent(ANALYTICS_EVENTS.SUPPORT_CHAT_START, {
      chat_type: chatType,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSupportChatMessage(messageLength: number, isFromUser: boolean) {
    trackEvent(ANALYTICS_EVENTS.SUPPORT_CHAT_MESSAGE, {
      message_length: messageLength,
      is_from_user: isFromUser,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSupportKnowledgeBaseView(article: string, category: string) {
    trackEvent(ANALYTICS_EVENTS.SUPPORT_KNOWLEDGE_BASE_VIEW, {
      article: article,
      category: category,
      timestamp: new Date().toISOString(),
    });
  }

  // Feature usage tracking
  static trackDarkModeToggle(isDarkMode: boolean) {
    trackEvent(ANALYTICS_EVENTS.DARK_MODE_TOGGLE, {
      is_dark_mode: isDarkMode,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSearchFilter(filterType: string, filterValue: any) {
    trackEvent(ANALYTICS_EVENTS.SEARCH_FILTER, {
      filter_type: filterType,
      filter_value: filterValue,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSortChange(sortBy: string, sortOrder: 'asc' | 'desc') {
    trackEvent(ANALYTICS_EVENTS.SORT_CHANGE, {
      sort_by: sortBy,
      sort_order: sortOrder,
      timestamp: new Date().toISOString(),
    });
  }
}
