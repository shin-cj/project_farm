import './CatalogPageState.css'

function CatalogPageState({
    title,
    message,
    actionLabel,
    onAction,
}) {
    return (
        <main className="catalog-page-state" aria-live="polite">
            <section className="catalog-page-state-card">
                <h1>{title}</h1>
                <p>{message}</p>

                {actionLabel && onAction && (
                    <button type="button" onClick={onAction}>
                        {actionLabel}
                    </button>
                )}
            </section>
        </main>
    )
}

export default CatalogPageState
