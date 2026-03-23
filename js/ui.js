
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

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
export function addNameTextBox (fragment, placeHolder="") {

    const elementContent = `
    <div class="create-name create-element">
        <h2>カウントダウンの名称</h2>
        <div class="create-name-text-box">
            <input type="text" placeholder="名称を入力…" class="create-name-text">
            <span class="create-name-text-border"></span>
        </div>
    </div>
    `

    const div = document.createElement("div");
    div.innerHTML = elementContent
    fragment.appendChild(div);

    const input = div.querySelector(".create-name-text")

    return {
        type: "title",
        getValue: () => input.value
    }
}

export function showModalLoading() {
    const createLoadingContent = document.getElementById("create-loading-content");
    createLoadingContent.classList.add("enable");
}

export function hideModalLoading() {
    const createLoadingContent = document.getElementById("create-loading-content");
    createLoadingContent.classList.remove("enable");
}

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
