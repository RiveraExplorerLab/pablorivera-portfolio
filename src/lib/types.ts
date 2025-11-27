// src/lib/types.ts
import { Timestamp } from 'firebase/firestore'

// ============================================
// Blog Posts
// ============================================
export interface BlogPost {
  id: string
  slug: string
  title: string
  summary: string
  markdown: string
  coverImage: string | null
  tags: string[]
  draft: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt: Timestamp | null
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>

// ============================================
// Projects
// ============================================
export interface ChangelogEntry {
  title: string
  content: string  // markdown
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  coverImage: string | null
  repoUrl: string | null
  liveUrl: string | null
  techStack: string[]
  tags: string[]
  featured: boolean
  draft: boolean
  requiresAuth: boolean
  accessRequestEnabled: boolean
  technicalDoc: string | null      // markdown
  userGuide: string | null          // markdown
  changeLog: ChangelogEntry[]       // array of {title, content}
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt: Timestamp | null
}

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>


// ============================================
// Community Signups
// ============================================
export interface CommunitySignup {
  id: string
  type: 'newsletter' | 'early-access'
  email: string
  notes: string | null
  tag: string | null
  userAgent: string | null
  deleted: boolean
  deletedAt: Timestamp | null
  createdAt: Timestamp
}

// ============================================
// Access Requests
// ============================================
export interface AccessRequest {
  id: string
  email: string
  name: string
  message: string
  projectId: string
  projectSlug: string
  projectTitle: string
  status: 'pending' | 'approved' | 'denied'
  statusChangedAt: Timestamp | null
  adminNote: string | null
  userAgent: string | null
  createdAt: Timestamp
  deleted: boolean
  deletedAt: Timestamp | null
}

export type AccessRequestStatus = AccessRequest['status']

// ============================================
// Project Access (Granted)
// ============================================
export interface ProjectAccess {
  id: string
  email: string
  name: string
  projectId: string
  projectSlug: string
  projectTitle: string
  grantedAt: Timestamp
  grantedBy: string
  expiresAt: Timestamp | null
  expirationNotifiedAt: Timestamp | null
  expired: boolean
  requestId: string | null
  revoked: boolean
  revokedAt: Timestamp | null
  revokedBy: string | null
  revokeReason: string | null
}
