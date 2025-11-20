import { FC, useState, useEffect } from 'react'

interface TypeWriterProps {
  text: string
  className?: string
  typingSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
  loop?: boolean
}

export const TypeWriter: FC<TypeWriterProps> = ({
  text,
  className = '',
  typingSpeed = 50,
  deleteSpeed = 30,
  pauseDuration = 5000,
  loop = true,
}) => {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping && !isDeleting) {
      if (displayText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        // Finished typing, pause then start deleting if loop is enabled
        if (loop) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, pauseDuration)
        }
      }
    } else if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length - 1))
        }, deleteSpeed)
      } else {
        // Finished deleting, start typing again
        setIsDeleting(false)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isTyping, isDeleting, text, typingSpeed, deleteSpeed, pauseDuration, loop])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">_</span>
    </span>
  )
}

export default TypeWriter
