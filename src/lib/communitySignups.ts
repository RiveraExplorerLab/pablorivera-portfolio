// src/lib/communitySignups.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { CommunitySignup } from './types'

const COLLECTION = 'communitySignups'

// ============================================
// READ: Admin queries
// ============================================

/**
 * Get all active signups (admin)
 */
export async function getActiveSignups(): Promise<CommunitySignup[]> {
  const q = query(
    collection(db, COLLECTION),
    where('deleted', '==', false),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CommunitySignup))
}

/**
 * Get signups by type (admin)
 */
export async function getSignupsByType(type: 'newsletter' | 'early-access'): Promise<CommunitySignup[]> {
  const q = query(
    collection(db, COLLECTION),
    where('deleted', '==', false),
    where('type', '==', type),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CommunitySignup))
}

// ============================================
// CREATE: Public mutations
// ============================================

/**
 * Newsletter signup (public)
 */
export async function createNewsletterSignup(email: string, userAgent?: string): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    type: 'newsletter',
    email: email.toLowerCase().trim(),
    notes: null,
    tag: null,
    userAgent: userAgent || null,
    deleted: false,
    deletedAt: null,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

/**
 * Early access signup (public)
 */
export async function createEarlyAccessSignup(
  email: string,
  notes?: string,
  tag?: string,
  userAgent?: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    type: 'early-access',
    email: email.toLowerCase().trim(),
    notes: notes || null,
    tag: tag || null,
    userAgent: userAgent || null,
    deleted: false,
    deletedAt: null,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

// ============================================
// UPDATE: Admin mutations
// ============================================

/**
 * Soft delete a signup (admin)
 */
export async function softDeleteSignup(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    deleted: true,
    deletedAt: Timestamp.now(),
  })
}

/**
 * Restore a soft-deleted signup (admin)
 */
export async function restoreSignup(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    deleted: false,
    deletedAt: null,
  })
}

// ============================================
// UTILITIES
// ============================================

/**
 * Check if email is already signed up for a specific type
 */
export async function isEmailSignedUp(email: string, type: 'newsletter' | 'early-access'): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION),
    where('type', '==', type),
    where('email', '==', email.toLowerCase().trim()),
    where('deleted', '==', false)
  )
  const snapshot = await getDocs(q)
  return !snapshot.empty
}
