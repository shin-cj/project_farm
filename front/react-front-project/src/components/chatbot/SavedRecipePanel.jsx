import { useEffect, useState } from "react";
import chatbotApi from "../../api/chatbotApi.js";
import "./SavedRecipePanel.css";

function SavedRecipePanel({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        chatbotApi.getSavedRecipes(userId)
            .then(response => setRecipes(response.data))
            .catch(error => {
                console.error(error);
                setError("저장한 레시피를 불러오지 못했습니다.");
            })
            .finally(() => setLoading(false));
    }, [userId]);

    const handleDeleteRecipe = async () => {
        if (!selectedRecipe || deleting) {
            return;
        }

        const confirmed = window.confirm("저장한 레시피를 삭제하시겠습니까?");
        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            await chatbotApi.deleteSavedRecipe(userId, selectedRecipe.chatbotId);

            setRecipes(previous =>
                previous.filter(recipe => recipe.chatbotId !== selectedRecipe.chatbotId)
            );
            setSelectedRecipe(null);
        } catch (error) {
            console.error(error);
            window.alert("저장한 레시피를 삭제하지 못했습니다.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <aside className="saved-recipe-panel">
                <div className="saved-recipe-header">
                    <h2>저장한 레시피</h2>
                    <span>{recipes.length}개</span>
                </div>

                {loading && <p className="saved-recipe-message">불러오는 중...</p>}
                {error && <p className="saved-recipe-error">{error}</p>}

                {!loading && !error && (
                    <div className="saved-recipe-list">
                        {recipes.length === 0 ? (
                            <p className="saved-recipe-message">
                                저장한 레시피가 없습니다.
                            </p>
                        ) : (
                            recipes.map(recipe => (
                                <button
                                    type="button"
                                    className="saved-recipe-item"
                                    key={recipe.chatbotId}
                                    onClick={() => setSelectedRecipe(recipe)}
                                >
                                    <strong>{recipe.recipeTitle}</strong>
                                    <span>
                                        {new Date(recipe.createdAt).toLocaleDateString("ko-KR")}
                                    </span>
                                    <small>{recipe.question}</small>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </aside>

            {selectedRecipe && (
                <div
                    className="saved-recipe-backdrop"
                    onClick={() => setSelectedRecipe(null)}
                >
                    <div
                        className="saved-recipe-modal"
                        role="dialog"
                        aria-modal="true"
                        onClick={event => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="saved-recipe-close"
                            onClick={() => setSelectedRecipe(null)}
                        >
                            ×
                        </button>

                        <h2>{selectedRecipe.recipeTitle}</h2>

                        <h3>추천 요청</h3>
                        <p>{selectedRecipe.question}</p>

                        <h3>조리 방법</h3>
                        <ol className="saved-recipe-steps">
                            {(selectedRecipe.recipe
                                ?.split(/\r?\n/)
                                .map(step => step.trim())
                                .filter(Boolean) ?? []
                            ).map((step, index) => (
                                    <li className="saved-recipe-step" key={index}>
                                        <p>{step.replace(/^\d+[.)]\s*/, "")}</p>
                                    </li>
                                ))}
                        </ol>
                        <h3>참고 사항</h3>
                        <p>{selectedRecipe.remark}</p>

                        <div className="saved-recipe-actions">
                            <button
                                type="button"
                                className="saved-recipe-delete"
                                onClick={handleDeleteRecipe}
                                disabled={deleting}
                            >
                                {deleting ? "삭제 중..." : "레시피 삭제"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SavedRecipePanel;
