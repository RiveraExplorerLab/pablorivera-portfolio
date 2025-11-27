// src/lib/accessRequests.ts
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
import type { AccessRequest, AccessRequestStatus } from './types'

const COLLECTION = 'accessRequests'

// ============================================
// READ: Admin queries
// ============================================

/**
 * Get all active (non-deleted) access requests (admin)
 */
export async function getAccessRequests(): Promise<AccessRequest[]> {
  const q = query(
    collection(db, COLLECTION),
    where('deleted', '==', false),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AccessRequest))
}

/**
 * Get pending access requests (admin)
 */
export async function getPendingRequests(): Promise<AccessRequest[]> {
  const q = query(
    collection(db, COLLECTION),
    where('deleted', '==', false),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AccessRequest))
}

/**
 * Get requests by status (admin)
 */
export async function getRequestsByStatus(status: AccessRequestStatus): Promise<AccessRequest[]> {
  const q = query(
    collection(db, COLLECTION),
    where('deleted', '==', false),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AccessRequest))
}

/**
 * Get requests for a specific project (admin)
 */
export async function getRequestsByProject(projectId: string): Promise<AccessRequest[]> {
  const q = query(
    collection(db, COLLECTION),
    where('deleted', '==', false),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AccessRequest))
}

// ============================================
// CREATE: Public mutation
// ============================================

/**
 * Create an access request (public)
 */
export async function createAccessRequest(
  email: string,
  name: string,
  message: string,
  projectId: string,
  projectSlug: string,
  projectTitle: string,
  userAgent?: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    email: email.toLowerCase().trim(),
    name: name.trim(),
    message: message.trim(),
    projectId,
    projectSlug,
    projectTitle,
    status: 'pending',
    statusChangedAt: null,
    adminNote: null,
    userAgent: userAgent || null,
    createdAt: Timestamp.now(),
    deleted: false,
    deletedAt: null,
  })
  return docRef.id
}

// ============================================
// UPDATE: Admin mutations
// ============================================

/**
 * Update request status (admin)
 */
export async function updateRequestStatus(
  id: string,
  status: AccessRequestStatus,
  adminNote?: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    status,
    statusChangedAt: Timestamp.now(),
    adminNote: adminNote || null,
  })
}

/**
 * Soft delete a request (admin)
 */
export async function softDeleteRequest(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    deleted: true,
    deletedAt: Timestamp.now(),
  })
}

// ============================================
// UTILITIES
// ============================================

/**
 * Check if user already has a pending request for a project (public)
 */
export async function hasPendingRequest(email: string, projectId: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION),
    where('email', '==', email.toLowerCase().trim()),
    where('projectId', '==', projectId),
    where('status', '==', 'pending'),
    where('deleted', '==', false),
    limit(1)
  )
  const snapshot = await getDocs(q)
  return !snapshot.empty
}
