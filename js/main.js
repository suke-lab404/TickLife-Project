/*
没コードだらけのクソコードとなっています。
ちゃんとしたプログラマーさんはいらないコードをしっかり消しましょうね。
せっかく書いたコードへの未練が残ってしまってね、、、
*/

import * as ui from "./ui.js";

// ハックシュン！！の管理

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

    isOpenCreateModal = false;
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

    fields.push(ui.addNameTextBox(fragment));
    fields.push(ui.addDateOption(fragment));
    fields.push(ui.addUnitOption(fragment));

    createDatePicker.appendChild(fragment);
}


// 新規作成のプログラム
// flatpickrの設定
// const createDateInputConfig = flatpickr("#create-date-input", {
//     locale: "ja",
//     enableTime: true
// })

// const createDateBox = document.getElementById("create-date-box");

// createDateBox.addEventListener("click", e => {
//     createDateInputConfig.open();
// })




// カレンダーを開くプログラム
// const createMainDateBox = document.getElementById("create-main-date-box");

// createMainDateBox.addEventListener("click", e => {
//     dateInput.open();
// })

// const dateInput = flatpickr('#dateInput', {
//     locale: "ja",
//     enableTime: true
// });