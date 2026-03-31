
export function initIconButton() {
    document.querySelectorAll(".icon-button").forEach(button => {
        
    })
}

export function resetCreateModal() {
    // 要素の取得
    const createDatePicker = document.getElementById("create-date-picker");
    const createLoadingContent = document.getElementById("create-loading-content");

    createDatePicker.replaceChildren();
    createLoadingContent.classList.add("enable");

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
 * @param {HTMLDivElement} elem
 */
function setElemDesc (elem, desc) {
    elem.querySelector(".create-desc-elem");
    console.log(`取得された要素：${elem}\n内容：${desc}`)
}

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
export function addLabel (fragment, text) {
    const elementContent = `
    <div class="create-label create-element">
        <p class="create-label-p"></p>
    </div>
    `

    const div = document.createElement("div");
    div.innerHTML = elementContent;
    fragment.appendChild(div);

    const paragrah = div.querySelector(".create-label-p");

    paragrah.innerHTML = text;

    return {
        type: "label"
    }
}

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
export function addNameTextBox (fragment, options={}) {
    options = {
        placeHolder: "名称を入力…",
        canEdit: true,
        default: "",
        description: "",
        ...options
    }

    const elementContent = `
    <div class="create-name create-element">
        <h2>名前</h2>
        <div class="create-name-text-box">
            <p class="create-elem-desc"></p>
            <input type="text" placeholder="名称を入力…" class="create-name-text">
            <span class="create-name-text-border"></span>
        </div>
    </div>
    `

    const div = document.createElement("div");
    div.innerHTML = elementContent;
    fragment.appendChild(div);

    const input = div.querySelector(".create-name-text")

    // 説明の設定(共通)
    setElemDesc(div, options.description);

    // オプションの適用
    if (!options.canEdit) {
        if (options.default) {
            input.disabled = true
        } else {
            console.warn("テキストボックスを空にしたまま、無効にするってwww。面白いですね。")
            console.error("テキストボックスを無効にする動作をキャンセルしました。")
        }
    }

    if (options.default) {
        input.value = options.default;
    }

    if (options.placeHolder) {
        input.placeholder = options.placeHolder;
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
export function addDateOption (fragment, options={}) {
    options = {
        canEdit: true,
        default: {
            year: -1,
            mon: 0,
            day: 0,
            hour: 0,
            min: 0
        },
        description: "",
        ...options
    }
    console.log(options.description);

    const elementContent = `
    <div class="create-date create-element" id="create-date">
        <h2>終了日時</h2>
        <div class="create-date-container">
            <p class="create-elem-desc"></p>
            <span>日時を選択</span>
            <div class="create-date-box">
                <input type="text" class="create-date-input" placeholder="時間と日時を選択してください">
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

    // 説明の設定(共通)
    setElemDesc(div, options.description);

    // カレンダー機能の設定
    const fp = flatpickr(input, {
        locale: "ja",
        enableTime: true
    });

    // 日時選択の画面が開くようにする
    createDateBox.addEventListener("click", () => {
        fp.open();
    })

    // オプションの適用
    if (options.default.year !== -1) {
        fp.setDate(`${options.default.year}-${options.default.mon}-${options.default.day} ${options.default.hour}:${options.default.min}`);
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
export function addUnitOption (fragment, options={}) {
    options = {
        canEdit: true,
        yrs: true,
        mth: true,
        wks: true,
        day: true,
        hrs: true,
        min: true,
        sec: true,
        default: "",
        description: "",
        ...options
    }

    const elementContent = `
    <div class="create-unit create-element">
        <h2>表示単位</h2>
        <p class="create-elem-desc"></p>
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

    // 説明の設定(共通)
    setElemDesc(div, options.description);

    let currentUnit = "";

    // 要素の取得
    const unitsBtn = div.querySelectorAll(".create-unit-button");
    unitsBtn.forEach((btn) => {

        const unitType = btn.classList[1];

        btn.addEventListener("click", () => {
            currentUnit = unitType;

            unitsBtn.forEach((btn2) => {
                btn2.classList.remove("selected");
            })

            btn.classList.add("selected");
        })

        if (unitType === "yrs" && !options.yrs) {
            btn.disabled = true;
        }
        if (unitType === "mth" && !options.mth) {
            btn.disabled = true;
        }
        if (unitType === "wks" && !options.wks) {
            btn.disabled = true;
        }
        if (unitType === "day" && !options.day) {
            btn.disabled = true;
        }
        if (unitType === "hrs" && !options.hrs) {
            btn.disabled = true;
        }
        if (unitType === "min" && !options.min) {
            btn.disabled = true;
        }
        if (unitType === "sec" && !options.sec) {
            btn.disabled = true;
        }


    })

    return {
        type: "unit",
        getValue: () => currentUnit
    }
}

/**
 * @param {DocumentFragment} fragment
 * @param {HTMLDivElement} createDatePicker
 */
export function addSubmitButton (fragment) {
    const elementContent = `
    <div class="create-submit create-element">
        <span class="create-submit-border"></span>
        <div class="create-submit-box">
            <button class="create-submit-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M12 7v5l3 3" /></svg>
                <span>作成する</span>
            </button>
        </div>
    </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = elementContent;
    fragment.appendChild(div);

    // 要素の取得
    const submitButton = div.querySelector(".create-submit-button");

    return {
        type: "submit",
        btnElem: submitButton
    }
}