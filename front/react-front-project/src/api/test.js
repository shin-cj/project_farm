export async function getRecentMarketPrices() {
    const params = new URLSearchParams({
        pageNo: '1',
        numOfRows: '10',
        returnType: 'JSON',
    })

    const response = await fetch(`/api01?${params}`)

    if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
            `시세 조회 실패: ${response.status} ${errorText}`,
        )
    }

    return response.json()
}