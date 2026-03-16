import * as ui from "./ui.js";

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


// 新規作成ダイアログ
const menuAddButton = document.getElementById("menu-add-button");
const overlay = document.getElementById("overlay");
const addDialog = document.getElementById("add-dialog");

let isOpenAddDialog = false

menuAddButton.addEventListener("click", e => {
    if (isOpenAddDialog === true) {
        return;
    }
    closeMenu();
    openAddDialog();
})

function openAddDialog(){
    if (isOpenAddDialog === true) {
        return;
    }
    isOpenAddDialog = true;

    overlay.classList.add("visible");
    addDialog.classList.add("open");
}

function closeAddDialog(){
    if (isOpenAddDialog === false) {
        return;
    }
    isOpenAddDialog = false;

    overlay.classList.remove("visible");
    addDialog.classList.remove("open");
}

// 新規作成、閉じるプログラム
const addDialogCloseButton = document.getElementById("add-dialog-close-button");

addDialogCloseButton.addEventListener("click", e => {
    closeAddDialog();
})