export function getApiErrorMessage(error, fallbackMessage) {
    const responseData = error?.response?.data

    if (typeof responseData === 'string' && responseData.trim()) {
        return responseData
    }

    if (responseData?.detail) {
        return responseData.detail
    }

    if (responseData?.message) {
        return responseData.message
    }

    if (!error?.response && error?.message) {
        return error.message
    }

    return fallbackMessage
}
