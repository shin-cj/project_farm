import { useState } from 'react'

function CatalogImage({
    src,
    alt,
    fallbackText = '이미지 준비중',
    fallbackClassName,
}) {
    const normalizedSrc = typeof src === 'string' ? src.trim() : ''
    const [failedSrc, setFailedSrc] = useState('')

    if (!normalizedSrc || failedSrc === normalizedSrc) {
        return (
            <span className={fallbackClassName} role="img" aria-label={fallbackText}>
                {fallbackText}
            </span>
        )
    }

    return (
        <img
            src={normalizedSrc}
            alt={alt}
            onLoad={() => setFailedSrc('')}
            onError={() => setFailedSrc(normalizedSrc)}
        />
    )
}

export default CatalogImage
