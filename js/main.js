/*
没コードだらけのクソコードとなっています。
ちゃんとしたプログラマーさんはいらないコードをしっかり消しましょうね。
せっかく書いたコードへの未練が残ってしまってね、、、
*/

import * as ui from "./ui.js";
import * as countdown from "./countdown.js";

// ハッシュの管理

function handleHash() {
    if (location.hash === "#settings") {
        console.log("設定画面を開く")
    } else if (location.hash === "#create") {
        openCreateModal();
    } else if (location.hash === "") {
        console.log("何も開かれていない")
        closeCreateModal();
    }
}

window.addEventListener("hashchange", handleHash);
window.addEventListener("load", handleHash)

// ヘッダーらへんの処理
// 要素の取得
const dropdown = document.getElementById("dropdown");
const dropDownButton = document.getElementById("dropdown-button");
const menuContainer = document.getElementById("menu-container");
let isOpenMenu = false;

dropDownButton.addEventListener("click", e => {
    // ページ遷移の抑制
    e.preventDefault();

    if (isOpenMenu === true) {
        closeMenu();
    }
    else if(isOpenMenu === false) {
        openMenu();
    }
})

dropDownButton.addEventListener("mouseover", e => {
    if (isOpenMenu === false) {
        dropDownButton.classList.add("hover");
    }
})
dropDownButton.addEventListener("mouseout", e => {
    if (isOpenMenu === false) {
        dropDownButton.classList.remove("hover");
    }
})

document.addEventListener("click", e => {
    if (!dropdown.contains(e.target)) {
        closeMenu();
    }
})

function openMenu(){
    isOpenMenu = true;
    menuContainer.classList.add("open");
    dropdown.classList.add("open");
}

function closeMenu(){
    isOpenMenu = false;
    menuContainer.classList.remove("open");
    dropdown.classList.remove("open");
    if (!dropDownButton.matches(":hover")){
        dropDownButton.classList.remove("hover");
    }
}

// 新規作成
// 新規作成画面を開くボタンの処理
const menuCreateButton = document.getElementById("menu-create-button");

menuCreateButton.addEventListener("click", e => {
    closeMenu();
    location.hash = "create";
})

// 新規作成画面
const overlay = document.getElementById("overlay");
const createModal = document.getElementById("create-modal");
const createCloseButton = document.getElementById("create-close-button");

let isOpenCreateModal = false;

function openCreateModal() {
    if (isOpenCreateModal){
        return;
    }

    ui.resetCreateModal();
    ui.showModalLoading();
    overlay.classList.add("visible");
    createModal.classList.add("open");

    setTimeout(() => {
        createDefaultDateModal();
        ui.hideModalLoading();
        isOpenCreateModal = true;
    }, 100);
}

function closeCreateModal() {
    if (!isOpenCreateModal) {
        return;
    }

    overlay.classList.remove("visible");
    createModal.classList.remove("open");
    const previewModal = document.getElementById("preview-modal");
    previewModal.classList.remove("open");

    location.hash = "";
    isOpenCreateModal = false;
}

function hideCreateModal() {
    createModal.classList.remove("open");
}

createCloseButton.addEventListener("click", e => {
    location.hash = "";
})

// 日付選択の部分の装飾
function createDefaultDateModal() {
    // フラグメントの設定
    const fragment = document.createDocumentFragment();
    // 要素の取得
    const createDatePicker = document.getElementById("create-date-picker");
    const createLoadingContent = document.getElementById("create-loading-content");
    // インプットの一覧
    const fields = [];

    fields.push(ui.addLabel(fragment, "名前と日時を設定して、カウントダウンを作成します"));
    fields.push(ui.addNameTextBox(fragment, {description: "カウントダウンの名称を決めます。(例：テストまで、卒業まで、80歳になるまで)"}));
    fields.push(ui.addDateOption(fragment, {description: "カウントダウンの終了日時を設定します。"}));
    //fields.push(ui.addUnitOption(fragment, {description: "実際にカウントダウンが表示されるときに使用される単位になります。"}));
    fields.push(ui.addSubmitButton(fragment));

    createDatePicker.appendChild(fragment);

    /** @type {HTMLButtonElement} */
    const submitButton = fields.find(element => element.type === "submit")?.btnElem;

    submitButton.addEventListener("click", () => {
        console.log("新規作成");
        extractDataFromFields(fields);
    })
}

function extractDataFromFields(fields) {
    // データの取得
    const countTitleObject = fields.find(item => item.type === "title");
    const countDatetimeObject = fields.find(item => item.type === "datetime");

    console.log(`タイトル：${countTitleObject.getValue()}\n日時：${countDatetimeObject.getValue()}`);

    if (countTitleObject.getValue() && countDatetimeObject.getValue()) {
        console.log("条件を満たしている");

        // データの作成
        const data = {
            title: countTitleObject.getValue(),
            datetime: countDatetimeObject.getValue()
        };

        hideCreateModal();

        requestCountdowns(data);
    } else {
        console.log("条件を満たしていない");
    }
}

// カウントダウンの確認
function requestCountdowns(data) {
    console.log(data)
    console.log("提出を承りました")

    // 要素の取得
    const previewModal = document.getElementById("preview-modal");
    const previewTitle = document.querySelector(".preview-title");
    const previewDatetime = document.querySelector(".preview-datetime");
    // ボタン
    const previewButtons = document.querySelector(".preview-btns");
    const previewAddButton = previewButtons.querySelector(".add-btn");
    const previewCancelButton = previewButtons.querySelector(".cancel-btn");

    previewTitle.textContent = `名前：${data.title}`;
    previewDatetime.textContent = `終了日時：${data.datetime[0].getFullYear()}年${data.datetime[0].getMonth() + 1}月${data.datetime[0].getDate()}日${data.datetime[0].getHours()}時${data.datetime[0].getMinutes()}分`

    setTimeout(() => {
        // 初期化
        let count = countdown.calcRemainingTime(data.datetime[0]);
        ui.updatePreviewCount(count);

        previewModal.classList.add("open");

        console.log("こんにちは")
        stop = countdown.startAccurateTimer(() => {
            count = countdown.calcRemainingTime(data.datetime[0]);
            console.log(count);
            ui.updatePreviewCount(count);
        })

        previewAddButton.addEventListener("click", (e) => {
            stop();
            closeCreateModal();
            addCountdown(data);
        })
    }, 500)
}

// カウントダウンを追加と保存
function addCountdown(data) {
    console.log(data);
    
}

// ダークモードのアニメーション
const query = window.matchMedia('(prefers-color-scheme: dark)');

// 初期状態の反映
if (query.matches) {
    document.documentElement.classList.toggle("dark-mode");
}

// osの変更を監視
query.addEventListener("change", (e) => {
    if (!document.startViewTransition) {
        document.documentElement.classList.toggle("dark-mode", e.matches);
        return;
    }

    // アニメーションの撮影
    document.startViewTransition(() => {
        document.documentElement.classList.toggle('dark-mode', e.matches);
    })
})