// src/lib/storage.ts
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload a cover image to Firebase Storage
 * @param file - The image file to upload
 * @param folder - The folder name ('posts' or 'projects')
 * @returns The public download URL
 */
export async function uploadCoverImage(
  file: File,
  folder: 'posts' | 'projects'
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${crypto.randomUUID()}.${ext}`
  const path = `covers/${folder}/${filename}`
  
  const storageRef = ref(storage, path)
  
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000', // 1 year cache
  })
  
  return getDownloadURL(storageRef)
}

/**
 * Delete a cover image from Firebase Storage
 * @param url - The Firebase Storage URL of the image to delete
 */
export async function deleteCoverImage(url: string): Promise<void> {
  if (!url) return
  
  try {
    // Extract the path from the URL
    // Firebase Storage URLs look like:
    // https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?alt=media&token=TOKEN
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/)
    
    if (pathMatch) {
      const encodedPath = pathMatch[1]
      const path = decodeURIComponent(encodedPath)
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    }
  } catch (err) {
    // Ignore errors (file might not exist or already deleted)
    console.warn('Failed to delete cover image:', err)
  }
}

/**
 * Get image dimensions (useful for responsive images - V2)
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File must be an image (JPEG, PNG, GIF, or WebP)' }
  }
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Image must be less than 5MB' }
  }
  
  return { valid: true }
}
