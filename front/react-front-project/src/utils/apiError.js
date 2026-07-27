export function getApiErrorMessage(_error, fallbackMessage) {
    return fallbackMessage || '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
}
