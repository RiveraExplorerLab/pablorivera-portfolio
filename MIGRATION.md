# Migration Cleanup Instructions

After the migration is complete, delete these old Supabase files:

```bash
# Remove old Supabase library files
rm src/lib/supabase.ts
rm src/lib/useSupabase.ts
rm src/lib/renderMd.ts
rm src/lib/slug.ts

# Remove old environment file (after backing up if needed)
rm .env.local  # Then create new one with Firebase config
```

## Files Created/Modified

### New Files
- `src/lib/firebase.ts` - Firebase initialization
- `src/lib/types.ts` - TypeScript interfaces
- `src/lib/blogPosts.ts` - Blog CRUD operations
- `src/lib/projects.ts` - Projects CRUD operations
- `src/lib/communitySignups.ts` - Community signups CRUD
- `src/lib/accessRequests.ts` - Access requests CRUD
- `src/lib/projectAccess.ts` - Granted access CRUD
- `src/lib/storage.ts` - Firebase Storage helpers (renamed from storageFirebase.ts)
- `src/lib/slugify.ts` - Slug utility
- `src/lib/markdown.ts` - Markdown rendering
- `src/hooks/useBlogPosts.ts` - Blog hooks
- `src/hooks/useProjects.ts` - Projects hooks
- `src/hooks/useCommunitySignups.ts` - Signups hooks
- `src/hooks/useAccessRequests.ts` - Access requests hooks
- `src/hooks/useProjectAccess.ts` - Project access hooks
- `src/routes/AdminAccess.tsx` - Access management page
- `firestore.rules` - Firestore security rules
- `storage.rules` - Storage security rules
- `firestore.indexes.json` - Firestore indexes
- `firebase.json` - Firebase configuration
- `.env.example` - Environment template

### Modified Files
- `src/providers/AuthProvider.tsx` - Now uses Firebase Auth
- `src/routes/Login.tsx` - Email/password login
- `src/routes/Admin.tsx` - Full rewrite with Firebase
- `src/routes/AdminCommunity.tsx` - Updated for Firebase
- `src/routes/Blog.tsx` - Uses new hooks
- `src/routes/Post.tsx` - Uses new hooks
- `src/routes/Projects.tsx` - Uses new hooks
- `src/routes/ProjectDetail.tsx` - Uses new hooks + access request form
- `src/routes/Home.tsx` - Uses new hooks for featured projects
- `src/routes/Community.tsx` - Uses Firebase for signups
- `src/router.tsx` - Added admin/access route
- `package.json` - Replaced Supabase with Firebase
- `.gitignore` - Added Firebase ignores
- `README.md` - Updated documentation

## Next Steps

1. **Create Firebase project** at https://console.firebase.google.com
2. **Enable services**: Firestore, Authentication (Email/Password), Storage
3. **Upgrade to Blaze plan** (required for full functionality)
4. **Create admin user** in Firebase Console → Authentication → Users
5. **Copy Firebase config** to `.env.local`
6. **Install dependencies**: `npm install`
7. **Deploy rules**: `firebase deploy --only firestore:rules,storage`
8. **Deploy indexes**: `firebase deploy --only firestore:indexes`
9. **Test locally**: `npm run dev`
10. **Deploy**: `npm run deploy`
