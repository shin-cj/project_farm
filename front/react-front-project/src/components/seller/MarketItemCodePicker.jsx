import { useEffect, useMemo, useState } from 'react'
import { CATEGORY_CODES, ITEM_CODES } from '../../pages/buyer/categoryData.js'
import './MarketItemCodePicker.css'

// 공공 시세 품목을 검색해 상품 등록 폼에 품목 코드를 전달합니다.
function MarketItemCodePicker({ value, onSelect, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [keyword, setKeyword] = useState('')

  const marketItems = useMemo(() => (
    CATEGORY_CODES
      .filter((category) => ['100', '200', '300', '400'].includes(category.value))
      .flatMap((category) => (
        (ITEM_CODES[category.value] ?? [])
          .filter((item) => item.value)
          .map((item) => ({ ...item, categoryName: category.label }))
      ))
  ), [])

  const normalizedKeyword = keyword.trim().replace(/\s+/g, '').toLowerCase()
  const filteredItems = marketItems.filter((item) => (
    item.label.replace(/\s+/g, '').toLowerCase().includes(normalizedKeyword)
    || item.value.includes(normalizedKeyword)
  ))
  const selectedItem = marketItems.find((item) => item.value === value)

  useEffect(() => {
    if (!isOpen) return undefined
    const handleEscape = (event) => event.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  function handleSelect(item) {
    onSelect(item.value)
    setKeyword('')
    setIsOpen(false)
  }

  return (
    <div className="market-item-code-picker">
      <label htmlFor="market-item-code">공공 시세 품목 코드</label>
      <div className="market-item-code-picker-control">
        <input
            id="market-item-code"
            value={selectedItem ? `${selectedItem.label} (${selectedItem.value})` : ''}
            placeholder="품목 찾기를 클릭하세요"
            readOnly
            required
        />
        <button type="button" onClick={() => setIsOpen(true)} disabled={disabled}>
          품목 찾기
        </button>
      </div>
      <input type="hidden" name="marketItemCode" value={value} />
      <small>선택한 품목 코드는 상품 시세 비교에 사용됩니다.</small>

      {isOpen && (
          <div
              className="market-item-code-picker-backdrop"
              onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}
          >
            <section
                className="market-item-code-picker-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="market-item-code-picker-title"
            >
              <div className="market-item-code-picker-header">
                <div>
                  <p>공공 시세 연동</p>
                  <h2 id="market-item-code-picker-title">품목 찾기</h2>
                </div>
                <button
                    type="button"
                    className="market-item-code-picker-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="품목 찾기 닫기"
                >×</button>
              </div>
              <input
                  className="market-item-code-picker-search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="예: 사과, 토마토, 감자 또는 코드 입력"
                  autoFocus
              />
              <p className="market-item-code-picker-guide">
                농산물 품목을 선택하면 코드가 자동으로 입력됩니다.
              </p>
              <div className="market-item-code-picker-list">
                {filteredItems.map((item) => (
                  <button
                      key={`${item.categoryName}-${item.value}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                  >
                    <span>{item.label}</span>
                    <small>{item.categoryName} · 코드 {item.value}</small>
                  </button>
                ))}
                {filteredItems.length === 0 && (
                  <p className="market-item-code-picker-empty">일치하는 농산물 품목이 없습니다.</p>
                )}
              </div>
            </section>
          </div>
      )}
    </div>
  )
}

export default MarketItemCodePicker
