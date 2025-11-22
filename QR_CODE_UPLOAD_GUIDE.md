# QR Code Photo Upload System
## Implementation Guide for Mission Command

---

## Overview

The QR Code Photo Upload system allows parents to seamlessly transfer gift card photos from their phone to their desktop computer. It's a key feature that makes the "parent-loaded vault" model feel magical and frictionless.

**User Flow:**
1. Parent is on desktop adding a gift card
2. App displays QR code
3. Parent scans with phone camera
4. Mobile browser opens upload page
5. Parent takes photo of gift card
6. Desktop page updates in real-time with photo
7. Parent continues entering card details

**Key Benefits:**
- No emailing photos to yourself
- No cable transfers
- No cloud sync needed (iCloud, Google Photos)
- Works on ANY phone (iOS, Android)
- Instant - whole flow takes 30 seconds
- Real-time sync feels like magic

---

## Quick Start

### 1. Install Dependencies
```bash
npm install qrcode
```

### 2. Create Database Table
```sql
CREATE TABLE upload_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  photo_url TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP
);
```

### 3. Create Storage Bucket
- Go to Supabase dashboard
- Storage → Create bucket: `gift-card-photos`
- Make it **PRIVATE** (not public)
- Set up RLS policies (see Security section)

### 4. Add Route for Mobile Upload
```javascript
// App.jsx or routes config
<Route path="/upload/:sessionId" element={<MobileUploadPage />} />
```

---

## Complete Code Examples

See full implementation code in the guide above for:
- `createUploadSession()` function
- `QRCodeUpload` component (desktop)
- `MobileUploadPage` component (mobile)
- Styling examples
- Security policies

---

## How It Works (Technical)

### Step 1: Session Creation
```
Desktop: User clicks "Add Gift Card"
  ↓
Generate unique session ID (UUID)
  ↓
Store in database with 10-minute expiry
  ↓
Generate QR code: missioncommand.app/upload/{session-id}
  ↓
Display QR code on screen
```

### Step 2: Mobile Upload
```
Phone: Scan QR code
  ↓
Browser opens: /upload/{session-id}
  ↓
Fetch session from database
  ↓
Check: Not expired? Not used? Valid?
  ↓
Show camera interface
  ↓
User takes photo
  ↓
Upload to Supabase Storage: family-id/session-id.jpg
  ↓
Update database: photo_url, status='completed'
```

### Step 3: Real-Time Sync
```
Desktop: Subscribe to session changes (Supabase real-time)
  ↓
Database UPDATE event fires
  ↓
Desktop receives: { photo_url: "..." }
  ↓
Display photo thumbnail
  ↓
User continues with form
```

---

## Key Features

### Security
- ✅ 10-minute session expiry
- ✅ One-time use (can't reuse QR)
- ✅ Family-scoped uploads
- ✅ Private storage bucket
- ✅ File type validation
- ✅ Size limits (10MB max)

### User Experience
- ✅ Visual countdown timer
- ✅ Clear instructions
- ✅ Mobile-optimized interface
- ✅ Success confirmations
- ✅ Error handling
- ✅ Fallback manual URL

### Performance
- ✅ Real-time updates (<1 second)
- ✅ Automatic session cleanup
- ✅ Optimized image storage
- ✅ Fast QR generation

---

## Testing Guide

### Desktop Tests:
```javascript
// Test 1: QR code generation
- Click "Add Gift Card"
- Verify QR code appears
- Verify timer counts down from 10:00

// Test 2: Session expiry
- Wait 10 minutes
- Verify QR code shows "Expired - Generate new code"

// Test 3: Real-time update
- Scan QR with phone
- Upload photo
- Verify photo appears on desktop within 2 seconds
```

### Mobile Tests:
```javascript
// Test 4: QR scan
- Scan QR code
- Verify upload page opens
- Verify session is valid

// Test 5: Photo upload
- Take photo
- Verify upload progress shown
- Verify success message displays

// Test 6: Expired session
- Try to use old QR code
- Verify error: "Session expired"
```

---

## Troubleshooting

### Problem: QR code won't scan
**Solutions:**
- Increase screen brightness
- Make QR code larger (300x300px minimum)
- Use different QR scanner app
- Try manual URL entry

### Problem: Real-time not updating
**Solutions:**
- Check Supabase real-time is enabled
- Verify RLS policies
- Check browser console for errors
- Ensure session ID matches

### Problem: Photo upload fails
**Solutions:**
- Check storage bucket exists
- Verify RLS policies
- Check file size (<10MB)
- Inspect network requests

---

## Production Checklist

- [ ] Create `gift-card-photos` storage bucket
- [ ] Configure RLS policies
- [ ] Deploy mobile upload route
- [ ] Test on real devices (iOS + Android)
- [ ] Set up session cleanup cron
- [ ] Monitor storage usage
- [ ] Add error tracking (Sentry)

---

## Future Enhancements

### Phase 2:
- OCR code extraction from photos
- Bulk photo upload (multiple cards)
- Photo editing (crop, rotate)
- Camera framing guides
- Auto-compression

### Phase 3:
- Custom QR styling (with logo)
- Smart card detection (Roblox vs Amazon)
- Automatic code validation
- Photo quality suggestions

---

This QR code system is the "wow" factor that makes Mission Command feel premium and modern. Parents will love how seamless it is.
