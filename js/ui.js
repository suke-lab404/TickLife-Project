
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
    const descDiv = elem.querySelector(".create-elem-desc");
    descDiv.innerHTML = desc;
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

    const paragraph = div.querySelector(".create-label-p");

    paragraph.innerHTML = text;

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
        <p class="create-elem-desc"></p>
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

    // 説明の設定(共通)
    setElemDesc(div, options.description);

    // オプションの適用
    if (!options.canEdit) {
        if (options.default) {
            input.disabled = true;
        } else {
            // 値がない状態で無効化することはできないため、処理をスキップします
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

    const elementContent = `
    <div class="create-date create-element" id="create-date">
        <h2>終了日時</h2>
        <p class="create-elem-desc"></p>
        <div class="create-date-container">
            <!-- <span>日時を選択</span> -->
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
        enableTime: true,
        onChange: function(selectedDates) {
            const d = selectedDates[0];

            const isoLocal = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}T${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:00`;
        }
    });

    // 日時選択の画面が開くようにする
    createDateBox.addEventListener("click", () => {
        fp.open();
    })

    // オプションの適用
    if (options.default.year !== -1) {
        fp.setDate(`${options.default.year}-${options.default.mon}-${options.default.day} ${options.default.hour}:${options.default.min}`);
    }


    return {
        type: "datetime",
        getValue: () => fp.selectedDates[0]
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

            unitsBtn.forEach((btn2) => {
                btn2.classList.remove("selected");
            })

            if (currentUnit !== unitType) {
                btn.classList.add("selected");
                currentUnit = unitType;
            } else {
                currentUnit = undefined;
            }

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

/**
 * カウントダウンの表示（年・日・時・分・秒）を更新します。
 * プレビュー画面とメイン画面の両方で共通して使用します。
 * @param {Object} count - 残り時間のオブジェクト（yrs, day, hrs, min, sec）
 * @param {HTMLElement} parent - 更新対象の親要素（document または特定のモーダル要素など）
 */
export function updateCountDisplay(count, parent = document) {
    // 指定された親要素の中から、各数値を入れるためのボックスを探します。
    const countYrs = parent.querySelector(".preview-count-box.yrs");
    const countDay = parent.querySelector(".preview-count-box.day");
    const countHrs = parent.querySelector(".preview-count-box.hrs");
    const countMin = parent.querySelector(".preview-count-box.min");
    const countSec = parent.querySelector(".preview-count-box.sec");

    // 1桁の数字の頭に「0」をつけて2桁にする補助関数です（例：5 -> 05）。
    function padZero(number) {
        if (typeof number !== "string") {
            number = String(number);
        }
        return number.length === 1 ? "0" + number : number;
    }

    // 各要素が存在する場合のみ、数値を反映させます。
    if (countYrs) {
        countYrs.textContent = padZero(count.yrs);
        // 「年」が0の場合は、デザインをスッキリさせるために非表示にします。
        if (count.yrs === 0) {
            countYrs.classList.add("unvisible");
        } else {
            countYrs.classList.remove("unvisible");
        }
    }
    
    if (countDay) countDay.textContent = padZero(count.day);
    if (countHrs) countHrs.textContent = padZero(count.hrs);
    if (countMin) countMin.textContent = padZero(count.min);
    if (countSec) countSec.textContent = padZero(count.sec);
}

/**
 * プレビューモーダル内のカウント表示を更新します（既存コードとの互換用）。
 * @param {Object} count - 残り時間のオブジェクト
 */
export function updatePreviewCount (count) {
    const previewModal = document.getElementById("preview-modal");
    updateCountDisplay(count, previewModal);
}

/**
 * メニュー内にカウントダウンのリストを描画します。
 * @param {HTMLElement} container - リストを入れる器（menu-list）
 * @param {Array} list - 保存されているデータの配列
 * @param {string} currentId - 現在選択中のID（スタイル適用のために使用）
 * @param {Function} onSelect - アイテムがクリックされた時のコールバック
 * @param {Function} onDelete - 削除ボタンがクリックされた時のコールバック
 */
export function renderCountdownList(container, list, currentId, onSelect, onDelete) {
    // 一旦中身を空にします
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = '<p style="font-size:14px; color:var(--color-text-subtle); padding:10px;">保存された項目がありません</p>';
        return;
    }

    // データの数だけループして、要素を作成します
    list.forEach(item => {
        const itemBtn = document.createElement("button");
        itemBtn.className = "menu-item";
        if (item.id === currentId) {
            itemBtn.classList.add("selected");
        }

        // タイトル部分
        const titleSpan = document.createElement("span");
        titleSpan.className = "menu-item-title";
        titleSpan.textContent = item.title;
        itemBtn.appendChild(titleSpan);

        // 削除ボタン
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "menu-item-delete";
        deleteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        `;
        deleteBtn.title = "削除";
        
        // 削除ボタン自体のクリックイベント
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // ボタンのクリックが親のitemBtnに伝わらないようにします
            onDelete(item.id);
        });
        
        itemBtn.appendChild(deleteBtn);

        // アイテム全体の選択イベントの設定
        itemBtn.addEventListener("click", () => {
            onSelect(item.id);
        });

        container.appendChild(itemBtn);
    });
}