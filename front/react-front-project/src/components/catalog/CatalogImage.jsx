import { useState } from 'react'

function CatalogImage({
    src,
    alt,
    fallbackText = '이미지 준비중',
    fallbackClassName,
}) {
    const normalizedSrc = typeof src === 'string' ? src.trim() : ''
    const imageSrc = normalizedSrc.startsWith('/uploads/')
        ? `http://localhost:8080${normalizedSrc}`
        : normalizedSrc
    const [failedSrc, setFailedSrc] = useState('')

    if (!imageSrc || failedSrc === imageSrc) {
        return (
            <span className={fallbackClassName} role="img" aria-label={fallbackText}>
                {fallbackText}
            </span>
        )
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            onLoad={() => setFailedSrc('')}
            onError={() => setFailedSrc(imageSrc)}
        />
    )
}

export default CatalogImage
