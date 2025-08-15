import { supabase } from './supabase'

const BUCKET = 'covers'

export async function uploadCover(file: File) {
  const ext = file.name.split('.').pop() || 'jpg'
  const name = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return `covers/${name}` // cover_path
}

export function publicUrlFromPath(cover_path?: string | null) {
  if (!cover_path) return null
  const [bucket, ...rest] = cover_path.split('/')
  const key = rest.join('/')
  const { data } = supabase.storage.from(bucket).getPublicUrl(key)
  return data.publicUrl
}

export async function removeCover(cover_path?: string | null) {
  if (!cover_path) return
  const [bucket, ...rest] = cover_path.split('/')
  const key = rest.join('/')
  await supabase.storage.from(bucket).remove([key])
}