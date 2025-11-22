import { FC, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Button } from '../ui/Button'

interface QRCodeUploadProps {
  sessionId: string
  onPhotoReceived: (photoUrl: string) => void
  expiryMinutes?: number
}

export const QRCodeUpload: FC<QRCodeUploadProps> = ({
  sessionId,
  onPhotoReceived,
  expiryMinutes = 10,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [timeRemaining, setTimeRemaining] = useState(expiryMinutes * 60)
  const [isExpired, setIsExpired] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      // In production, this would be your actual domain
      const uploadUrl = `${window.location.origin}/upload/${sessionId}`

      try {
        const dataUrl = await QRCode.toDataURL(uploadUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#00ff88',
            light: '#0a0f14',
          },
        })
        setQrDataUrl(dataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQR()
  }, [sessionId])

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Simulate receiving photo (in production, this would use Supabase real-time)
  useEffect(() => {
    // Demo: simulate photo upload after 5 seconds if not expired
    // In production, you'd subscribe to Supabase real-time updates
    const demoTimer = setTimeout(() => {
      if (!isExpired && !photoUrl) {
        // Don't auto-trigger in production
        // This is just for demo purposes
      }
    }, 5000)

    return () => clearTimeout(demoTimer)
  }, [isExpired, photoUrl])

  // Handle photo received
  const handlePhotoReceived = (url: string) => {
    setPhotoUrl(url)
    onPhotoReceived(url)
  }

  // For demo: manual trigger
  const simulatePhotoUpload = () => {
    const demoUrl = `https://placehold.co/400x300/1a2332/00ff88?text=Gift+Card+Photo`
    handlePhotoReceived(demoUrl)
  }

  if (isExpired && !photoUrl) {
    return (
      <div className="bg-bg-tertiary border border-border-primary p-6 text-center">
        <div className="text-accent-danger text-3xl mb-4">⚠</div>
        <div className="text-sm font-mono text-accent-danger uppercase mb-4">
          SESSION EXPIRED
        </div>
        <p className="text-xs font-mono text-text-muted mb-4">
          The QR code has expired. Generate a new one to continue.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setTimeRemaining(expiryMinutes * 60)
            setIsExpired(false)
          }}
        >
          GENERATE NEW CODE
        </Button>
      </div>
    )
  }

  if (photoUrl) {
    return (
      <div className="bg-bg-tertiary border border-accent-primary p-6">
        <div className="text-center mb-4">
          <div className="text-accent-primary text-2xl mb-2">✓</div>
          <div className="text-sm font-mono text-accent-primary uppercase">
            PHOTO RECEIVED
          </div>
        </div>
        <div className="bg-bg-secondary p-2 border border-border-subtle">
          <img
            src={photoUrl}
            alt="Gift card"
            className="w-full h-auto max-h-48 object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-tertiary border border-border-primary p-6">
      <div className="text-center mb-4">
        <div className="text-sm font-mono text-accent-secondary uppercase mb-2">
          SCAN TO UPLOAD PHOTO
        </div>
        <p className="text-xs font-mono text-text-muted">
          Use your phone to take a photo of the gift card
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="w-48 h-48"
          />
        ) : (
          <div className="w-48 h-48 bg-bg-secondary animate-pulse" />
        )}
      </div>

      {/* Timer */}
      <div className="text-center mb-4">
        <div className="text-xs font-mono text-text-muted uppercase mb-1">
          TIME REMAINING
        </div>
        <div className={`text-2xl font-mono font-bold ${
          timeRemaining < 60 ? 'text-accent-danger' : 'text-accent-primary'
        }`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Manual URL fallback */}
      <div className="border-t border-border-subtle pt-4">
        <div className="text-xs font-mono text-text-muted uppercase mb-2">
          OR ENTER URL MANUALLY
        </div>
        <div className="text-xs font-mono text-text-muted break-all bg-bg-secondary p-2 border border-border-subtle">
          {window.location.origin}/upload/{sessionId}
        </div>
      </div>

      {/* Demo button - remove in production */}
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <Button
          variant="secondary"
          fullWidth
          onClick={simulatePhotoUpload}
        >
          DEMO: SIMULATE PHOTO UPLOAD
        </Button>
      </div>
    </div>
  )
}

export default QRCodeUpload
