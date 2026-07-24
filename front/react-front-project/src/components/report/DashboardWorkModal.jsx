import { useEffect } from "react";
import "./DashboardWorkModal.css";

function DashboardWorkModal({
                                modal,
                                onClose,
                                onItemClick
                            }) {
    useEffect(() => {
        if (!modal.open) {
            return;
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [modal.open, onClose]);

    if (!modal.open) {
        return null;
    }

    return (
        <div
            className="dashboard-work-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="dashboard-work-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dashboard-work-title"
            >
                <header className="dashboard-work-modal-header">
                    <div>
                        <h2 id="dashboard-work-title">
                            {modal.title}
                        </h2>

                        <span>{modal.items.length}건</span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="목록 팝업 닫기"
                    >
                        ×
                    </button>
                </header>

                {modal.loading && (
                    <p className="dashboard-work-state">
                        데이터를 불러오는 중입니다.
                    </p>
                )}

                {modal.error && (
                    <p className="dashboard-work-error">
                        {modal.error}
                    </p>
                )}

                {!modal.loading &&
                    !modal.error &&
                    modal.items.length === 0 && (
                        <p className="dashboard-work-state">
                            해당하는 데이터가 없습니다.
                        </p>
                    )}

                {!modal.loading &&
                    !modal.error &&
                    modal.items.length > 0 && (
                        <div className="dashboard-work-modal-list">
                            {modal.items.map((item) => (
                                <button
                                    type="button"
                                    className="dashboard-work-modal-item"
                                    key={`${item.kind}-${item.id}`}
                                    onClick={() =>
                                        onItemClick(item)
                                    }
                                >
                                    <div className="dashboard-work-item-main">
                                        <strong>
                                            {item.title}
                                        </strong>

                                        <span>
                                            {item.subtitle}
                                        </span>

                                        <p>
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="dashboard-work-item-side">
                                        <span>
                                            {item.status}
                                        </span>

                                        <time>
                                            {item.createdAt
                                                ? new Date(
                                                    item.createdAt
                                                ).toLocaleString(
                                                    "ko-KR"
                                                )
                                                : "일시 없음"}
                                        </time>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
            </section>
        </div>
    );
}

export default DashboardWorkModal;