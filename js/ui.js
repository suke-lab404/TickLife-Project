
export function initIconButton() {
    document.querySelectorAll(".icon-button").forEach(button => {
        
    })
}

export function resetCreateModal() {
    // 要素の取得
    const createDatePicker = document.getElementById("create-date-picker");
    const createLoadingContent = document.getElementById("create-loading-content");

    // createDatePicker.replaceChildren();
    // createLoadingContent.classList.add("enable");
}

export function createDefaultDateModal() {
    // フラグメントの設定
    const fragment = document.createDocumentFragment();
    // 要素の取得
    const createDatePicker = document.getElementById("create-date-picker");
    const createLoadingContent = document.getElementById("create-loading-content");


}

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
function addNameTextBox (fragment, createDatePicker, placeHolder="") {

    const elementContent = `
    <div class="create-name create-element" id="create-name">
        <h2>カウントダウンの名称</h2>
        <div class="create-name-text-box">
            <input type="text" id="create-name-text" placeholder="名称を入力…" class="create-name-text">
            <span class="create-name-text-border"></span>
        </div>
    </div>
    `

    const div = document.createElement("div");
    div.textContent = elementContent
    fragment.appendChild(div);
}