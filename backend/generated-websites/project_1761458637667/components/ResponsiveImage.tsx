import Image from 'next/image'
import { useBreakpoint } from '@/lib/responsive'

interface ResponsiveImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function ResponsiveImage({ src, alt, width, height, className }: ResponsiveImageProps) {
  const breakpoint = useBreakpoint()
  
  const getImageSize = () => {
    switch (breakpoint) {
      case 'sm': return { width: width * 0.5, height: height * 0.5 }
      case 'md': return { width: width * 0.75, height: height * 0.75 }
      case 'lg': return { width: width, height: height }
      default: return { width: width, height: height }
    }
  }

  const { width: imgWidth, height: imgHeight } = getImageSize()

  return (
    <Image
      src={src}
      alt={alt}
      width={imgWidth}
      height={imgHeight}
      className={className}
      priority
    />
  )
}