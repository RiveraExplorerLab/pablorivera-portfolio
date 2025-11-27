// src/lib/projectAccess.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { ProjectAccess } from './types'

const COLLECTION = 'projectAccess'

// ============================================
// READ: Admin queries
// ============================================

/**
 * Get all active (non-revoked, non-expired) access grants (admin)
 */
export async function getActiveAccess(): Promise<ProjectAccess[]> {
  const q = query(
    collection(db, COLLECTION),
    where('revoked', '==', false),
    where('expired', '==', false),
    orderBy('grantedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProjectAccess))
}

/**
 * Get all access grants including revoked/expired (admin)
 */
export async function getAllAccess(): Promise<ProjectAccess[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('grantedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProjectAccess))
}

/**
 * Get access grants for a specific project (admin)
 */
export async function getAccessByProject(projectId: string): Promise<ProjectAccess[]> {
  const q = query(
    collection(db, COLLECTION),
    where('projectId', '==', projectId),
    where('revoked', '==', false),
    where('expired', '==', false),
    orderBy('grantedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProjectAccess))
}

/**
 * Get access grants for a specific user email (admin)
 */
export async function getAccessByEmail(email: string): Promise<ProjectAccess[]> {
  const q = query(
    collection(db, COLLECTION),
    where('email', '==', email.toLowerCase().trim()),
    where('revoked', '==', false),
    where('expired', '==', false),
    orderBy('grantedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProjectAccess))
}

// ============================================
// CREATE: Admin mutation
// ============================================

/**
 * Grant access to a project (admin)
 */
export async function grantAccess(
  email: string,
  name: string,
  projectId: string,
  projectSlug: string,
  projectTitle: string,
  grantedBy: string,
  expiresAt?: Date | null,
  requestId?: string | null
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    email: email.toLowerCase().trim(),
    name: name.trim(),
    projectId,
    projectSlug,
    projectTitle,
    grantedAt: Timestamp.now(),
    grantedBy,
    expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
    expirationNotifiedAt: null,
    expired: false,
    requestId: requestId || null,
    revoked: false,
    revokedAt: null,
    revokedBy: null,
    revokeReason: null,
  })
  return docRef.id
}

// ============================================
// UPDATE: Admin mutations
// ============================================

/**
 * Revoke access (admin)
 */
export async function revokeAccess(
  id: string,
  revokedBy: string,
  reason?: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    revoked: true,
    revokedAt: Timestamp.now(),
    revokedBy,
    revokeReason: reason || null,
  })
}

/**
 * Update expiration date (admin)
 */
export async function updateExpiration(
  id: string,
  expiresAt: Date | null
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
    // Reset notification flag if date changed
    expirationNotifiedAt: null,
    // Reset expired flag if extending
    expired: false,
  })
}

/**
 * Mark access as expired (admin or scheduled function)
 */
export async function markAsExpired(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    expired: true,
  })
}

/**
 * Mark expiration notification sent (for scheduled function)
 */
export async function markExpirationNotified(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    expirationNotifiedAt: Timestamp.now(),
  })
}

// ============================================
// UTILITIES
// ============================================

/**
 * Check if user has active access to a project (public/admin)
 */
export async function hasActiveAccess(email: string, projectId: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION),
    where('email', '==', email.toLowerCase().trim()),
    where('projectId', '==', projectId),
    where('revoked', '==', false),
    where('expired', '==', false),
    limit(1)
  )
  const snapshot = await getDocs(q)
  return !snapshot.empty
}

/**
 * Get expiring access grants (for notification function - V2)
 * Returns grants expiring within the next X days that haven't been notified
 */
export async function getExpiringAccess(daysAhead: number = 3): Promise<ProjectAccess[]> {
  const now = new Date()
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)
  
  const q = query(
    collection(db, COLLECTION),
    where('revoked', '==', false),
    where('expired', '==', false),
    where('expirationNotifiedAt', '==', null),
    orderBy('expiresAt', 'asc')
  )
  
  const snapshot = await getDocs(q)
  const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProjectAccess))
  
  // Filter in memory for date range (Firestore can't do compound inequality on different fields)
  return results.filter((access) => {
    if (!access.expiresAt) return false
    const expiresDate = access.expiresAt.toDate()
    return expiresDate >= now && expiresDate <= futureDate
  })
}
