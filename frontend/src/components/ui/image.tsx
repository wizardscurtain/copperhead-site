import React from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  loading?: 'lazy' | 'eager'
}

const Image: React.FC<ImageProps> = ({ 
  width, 
  height, 
  priority, 
  quality, 
  loading = 'lazy',
  ...props 
}) => {
  return (
    <img
      {...props}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding="async"
    />
  )
}

export default Image