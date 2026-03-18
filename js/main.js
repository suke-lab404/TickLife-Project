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
const menuCreateButton = document.getElementById("menu-create-button");
const overlay = document.getElementById("overlay");
const createModal = document.getElementById("create-modal");

let isOpenCreateModal = false

menuCreateButton.addEventListener("click", e => {
    if (isOpenCreateModal === true) {
        return;
    }
    closeMenu();
    openCreateModal();
})

function openCreateModal(){
    if (isOpenCreateModal === true) {
        return;
    }
    isOpenCreateModal = true;

    overlay.classList.add("visible");
    createModal.classList.add("open");
}

function closeCreateModal(){
    if (isOpenCreateModal === false) {
        return;
    }
    isOpenCreateModal = false;

    overlay.classList.remove("visible");
    createModal.classList.remove("open");
}

// 新規作成、閉じるプログラム
const createModalCloseButton = document.getElementById("create-modal-close-button");

createModalCloseButton.addEventListener("click", e => {
    closeCreateModal();
})