import { FC, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export const MobileUpload: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }

    setPhoto(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!photo || !sessionId) return

    setUploading(true)
    setError(null)

    try {
      // In production, this would upload to Supabase Storage
      // and update the upload_sessions table

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // For demo, just show success
      setSuccess(true)

      // In production:
      // 1. Upload to Supabase Storage
      // 2. Update session with photo_url
      // 3. Desktop will receive real-time update

    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleTakePhoto = () => {
    fileInputRef.current?.click()
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-bg-secondary border border-accent-danger p-8 text-center max-w-sm w-full">
          <div className="text-accent-danger text-3xl mb-4">⚠</div>
          <div className="text-sm font-mono text-accent-danger uppercase mb-2">
            INVALID SESSION
          </div>
          <p className="text-xs font-mono text-text-muted">
            This upload link is invalid. Please scan a new QR code.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-bg-secondary border border-accent-primary p-8 text-center max-w-sm w-full">
          <div className="text-accent-primary text-5xl mb-4">✓</div>
          <h1 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-2">
            UPLOAD COMPLETE
          </h1>
          <p className="text-sm font-mono text-text-muted mb-4">
            Photo has been sent to your desktop. You can close this page.
          </p>
          <div className="text-xs font-mono text-text-muted">
            MISSION COMMAND
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="text-accent-primary text-3xl mb-4">▲</div>
          <h1 className="text-xl font-mono font-bold text-white uppercase tracking-wider mb-2">
            UPLOAD GIFT CARD PHOTO
          </h1>
          <p className="text-sm font-mono text-text-muted">
            Take a clear photo of the gift card
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-bg-secondary border border-border-primary p-6 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {preview ? (
            <div className="space-y-4">
              <div className="bg-bg-tertiary p-2 border border-border-subtle">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-contain"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setPhoto(null)
                    setPreview(null)
                  }}
                >
                  RETAKE
                </Button>
                <Button
                  variant="gold"
                  fullWidth
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'UPLOADING...' : 'SEND'}
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={handleTakePhoto}
              className="border-2 border-dashed border-border-primary p-8 text-center cursor-pointer hover:border-accent-primary transition-colors"
            >
              <div className="text-accent-primary text-4xl mb-4">📷</div>
              <div className="text-sm font-mono text-text-muted uppercase mb-2">
                TAP TO TAKE PHOTO
              </div>
              <p className="text-xs font-mono text-text-muted">
                or select from gallery
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-accent-danger/10 border border-accent-danger p-3">
              <p className="text-xs font-mono text-accent-danger">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-bg-secondary border border-border-primary p-4">
          <div className="text-xs font-mono text-accent-secondary uppercase mb-2">
            PHOTO TIPS
          </div>
          <ul className="text-xs font-mono text-text-muted space-y-1">
            <li>• Make sure the code is clearly visible</li>
            <li>• Avoid glare and shadows</li>
            <li>• Include the entire card in frame</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="text-xs font-mono text-text-muted">
            SESSION: {sessionId.substring(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileUpload
