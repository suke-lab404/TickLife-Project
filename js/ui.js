
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
export function addNameTextBox (fragment, placeHolder="名称を入力…", option={
    canEdit: true,
    default: "",
}) {

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
    div.innerHTML = elementContent;
    fragment.appendChild(div);

    const input = div.querySelector(".create-name-text")

    // オプションの適用
    if (!option.canEdit) {
        if (option.default) {
            input.disabled = true
        } else {
            console.warn("テキストボックスを空にしたまま、無効にするってwww。面白いですね。")
            console.error("テキストボックスを無効にする動作をキャンセルしました。")
        }
    }

    if (option.default) {
        input.value = option.default;
    }

    if (placeHolder) {
        input.placeholder = placeHolder;
    }



    return {
        type: "title",
        getValue: () => input.value
    }
}

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
export function addDateOption (fragment, option={
    canEdit: true,
    default: {
        year: -1,
        mon: 0,
        day: 0,
        hour: 0,
        min: 0
    }
}) {
    const elementContent = `
    <div class="create-date create-element" id="create-date">
        <h2>日時を指定</h2>
        <div class="create-date-container">
            <span>SELECT DATE AND TIME</span>
            <div class="create-date-box">
                <input type="text" class="create-date-input" placeholder="yyyy/mm//dd hh:mm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-week"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M7 14h.013" /><path d="M10.01 14h.005" /><path d="M13.01 14h.005" /><path d="M16.015 14h.005" /><path d="M13.015 17h.005" /><path d="M7.01 17h.005" /><path d="M10.01 17h.005" /></svg>
                <span class="create-date-border"></span>
            </div>
        </div>
    </div>
    `

    const div = document.createElement("div");
    div.innerHTML = elementContent;
    fragment.appendChild(div);

    // 要素の取得
    const input = div.querySelector(".create-date-input");
    const createDateBox = div.querySelector(".create-date-box");

    // カレンダー機能の設定
    const fp = flatpickr(input, {
        locale: "ja",
        enableTime: true
    });

    // 日時選択の画面が開くようにする
    createDateBox.addEventListener("click", () => {
        fp.open();
    })

    console.log(`${option.default.year}-${option.default.mon}-${option.default.day} ${option.default.hour}:${option.default.min}`)
    // オプションの適用
    if (option.default.year !== -1) {
        fp.setDate(`${option.default.year}-${option.default.mon}-${option.default.day} ${option.default.hour}:${option.default.min}`);
        console.log("あいうえお")
    }


    return {
        type: "datetime",
        getValue: () => fp.selectedDates
    }
}

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
export function addUnitOption (fragment, option={
    canEdit: true,
    yrs: true,
    mth: true,
    wks: true,
    day: true,
    hrs: true,
    min: true,
    sec: true,
    default: "",
}) {
    const elementContent = `
    <div class="create-unit create-element">
        <h2>表示する単位を選択</h2>
        <div class="create-unit-selector">
            <button class="create-unit-button yrs">年</button>
            <button class="create-unit-button mth">月</button>
            <button class="create-unit-button wks">週</button>
            <button class="create-unit-button day">日</button>
            <button class="create-unit-button hrs">時間</button>
            <button class="create-unit-button min">分</button>
            <button class="create-unit-button sec">秒</button>
        </div>
    </div>
    `
    /*
    yrs -> 年
    mth -> 月
    wks -> 週
    day -> 日
    hrs -> 時間
    min -> 分
    sec -> 秒
     */

    const div = document.createElement("div");
    div.innerHTML = elementContent;
    fragment.appendChild(div);

    let currentUnit = "";

    // 要素の取得
    const unitsBtn = div.querySelectorAll(".create-unit-button");
    console.log(unitsBtn);
    unitsBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            const unitType = btn.classList[1]
            currentUnit = unitType

            unitsBtn.forEach((btn2) => {
                btn2.classList.remove("selected");
            })

            btn.classList.add("selected");
        })
    })

    return {
        type: "unit",
        getValue: () => currentUnit
    }
}