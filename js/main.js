import * as ui from "./ui.js";

// ハックシュン！！の管理

function handleHash() {
    if (location.hash === "#settings") {
        console.log("設定画面を開く")
    } else if (location.hash === "#create") {
        openCreateModal();
    } else if (location.hash === "") {
        console.log("何も開かれていない")
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
    location.hash = "create";
})

// 新規作成画面


function openCreateModal() {

}