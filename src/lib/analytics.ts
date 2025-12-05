// src/lib/analytics.ts
import { logEvent } from 'firebase/analytics'
import { analytics } from './firebase'

// Track custom events
export const trackEvent = async (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  const analyticsInstance = await analytics
  if (analyticsInstance) {
    logEvent(analyticsInstance, eventName, params)
  }
}

// Pre-defined events for consistency
export const track = {
  // === CONTACT ===
  contactClick: (method: 'email' | 'github' | 'linkedin') => 
    trackEvent('contact_click', { method }),

  // === BLOG ===
  blogPostRead: (slug: string, readTime: number) => 
    trackEvent('blog_post_read', { slug, read_time: readTime }),
  
  blogPostShare: (slug: string) => 
    trackEvent('blog_post_share', { slug }),

  blogTocClick: (slug: string, heading: string) =>
    trackEvent('blog_toc_click', { slug, heading }),

  // === PROJECTS ===
  projectView: (projectId: string) => 
    trackEvent('project_view', { project_id: projectId }),

  projectLinkClick: (projectId: string, linkType: 'live' | 'github') =>
    trackEvent('project_link_click', { project_id: projectId, link_type: linkType }),

  // === RESUME / HIRING ===
  resumeDownload: () => 
    trackEvent('resume_download'),

  hireCtaClick: (location: string) =>
    trackEvent('hire_cta_click', { location }),

  // === ENGAGEMENT ===
  scrollDepth: (page: string, percent: 25 | 50 | 75 | 100) =>
    trackEvent('scroll_depth', { page, percent }),

  timeOnPage: (page: string, seconds: number) =>
    trackEvent('time_on_page', { page, seconds }),

  copyCode: (page: string) =>
    trackEvent('copy_code', { page }),

  // === EASTER EGGS ===
  easterEggFound: (eggName: string) => 
    trackEvent('easter_egg_found', { egg_name: eggName }),

  // === NEWSLETTER ===
  newsletterSignup: () => 
    trackEvent('newsletter_signup'),

  newsletterDismiss: () =>
    trackEvent('newsletter_dismiss'),

  // === NAVIGATION ===
  externalLinkClick: (url: string) => 
    trackEvent('external_link_click', { url }),

  searchUsed: (query: string) =>
    trackEvent('search_used', { query }),

  notFoundPage: (attemptedPath: string) =>
    trackEvent('not_found_page', { attempted_path: attemptedPath }),

  // === FUN INTERACTIONS ===
  funFactClick: () =>
    trackEvent('fun_fact_click'),

  currentlyClick: () =>
    trackEvent('currently_click'),

  logoClick: (clickCount: number) =>
    trackEvent('logo_click', { click_count: clickCount }),
}
