// src/lib/blogPosts.ts
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
import type { BlogPost, BlogPostInput } from './types'

const COLLECTION = 'blogPosts'

// ============================================
// READ: Public queries
// ============================================

/**
 * Get all published posts (public)
 */
export async function getPublishedPosts(maxResults = 30): Promise<BlogPost[]> {
  const q = query(
    collection(db, COLLECTION),
    where('draft', '==', false),
    orderBy('publishedAt', 'desc'),
    limit(maxResults)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost))
}

/**
 * Get single post by slug (public)
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(
    collection(db, COLLECTION),
    where('slug', '==', slug.toLowerCase()),
    where('draft', '==', false),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as BlogPost
}

// ============================================
// READ: Admin queries
// ============================================

/**
 * Get all posts including drafts (admin)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('updatedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost))
}

// ============================================
// CREATE
// ============================================

export async function createPost(input: BlogPostInput): Promise<string> {
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

export async function updatePost(id: string, input: Partial<BlogPostInput>): Promise<void> {
  const updates: Record<string, unknown> = {
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

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

// ============================================
// UTILITIES
// ============================================

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
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
