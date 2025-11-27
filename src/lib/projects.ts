// src/lib/projects.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Project, ProjectInput } from './types'

const COLLECTION = 'projects'

// ============================================
// READ: Public queries
// ============================================

/**
 * Get all published projects (public)
 */
export async function getPublishedProjects(): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    where('draft', '==', false),
    orderBy('publishedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project))
}

/**
 * Get featured projects for homepage (public)
 */
export async function getFeaturedProjects(maxResults = 3): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    where('draft', '==', false),
    where('featured', '==', true),
    orderBy('publishedAt', 'desc'),
    limit(maxResults)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project))
}

/**
 * Get single project by slug (public)
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(
    collection(db, COLLECTION),
    where('slug', '==', slug.toLowerCase()),
    where('draft', '==', false),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Project
}

// ============================================
// READ: Admin queries
// ============================================

/**
 * Get all projects including drafts (admin)
 */
export async function getAllProjects(): Promise<Project[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('updatedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project))
}

/**
 * Get project by ID (admin - includes drafts)
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const q = query(
    collection(db, COLLECTION),
    where('__name__', '==', id),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Project
}

// ============================================
// CREATE
// ============================================

export async function createProject(input: ProjectInput): Promise<string> {
  const now = Timestamp.now()
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    slug: input.slug.toLowerCase(),
    createdAt: now,
    updatedAt: now,
    publishedAt: input.draft ? null : now,
  })
  return docRef.id
}

// ============================================
// UPDATE
// ============================================

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {
    ...input,
    updatedAt: Timestamp.now(),
  }
  
  if (input.slug) {
    updates.slug = input.slug.toLowerCase()
  }
  
  // Set publishedAt when publishing for the first time
  if (input.draft === false && !input.publishedAt) {
    updates.publishedAt = Timestamp.now()
  }
  
  await updateDoc(doc(db, COLLECTION, id), updates)
}

// ============================================
// DELETE
// ============================================

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

// ============================================
// UTILITIES
// ============================================

/**
 * Check if a slug is available
 */
export async function isProjectSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION),
    where('slug', '==', slug.toLowerCase()),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return true
  if (excludeId && snapshot.docs[0].id === excludeId) return true
  return false
}
