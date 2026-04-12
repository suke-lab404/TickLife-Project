import * as ui from "./ui.js";
import * as countdown from "./countdown.js";

// アプリ起動時の処理（ハッシュの管理など）
function handleHash() {
    const hash = location.hash;

    if (hash === "#settings") {
        console.log("設定画面を開く")
    } else if (hash === "#create") {
        // 作成画面を開きます（リセットは別の場所で行うように調整しました）
        openCreateModal();
    } else if (hash.startsWith("#id=")) {
        // ID指定のハッシュがある場合、そのカウントダウンを表示します
        const id = hash.replace("#id=", "");
        console.log("指定されたIDを表示します:", id);
        startMainCountdown(id);
        closeCreateModal();
    } else if (hash === "") {
        console.log("何も開かれていない")
        closeCreateModal();
        
        // ハッシュが空のときは、保存されているデータがあれば最初の一個を表示するようにURLを更新します
        const list = countdown.getCountdowns();
        if (list.length > 0) {
            location.hash = `#id=${list[0].id}`;
        } else {
            // データが一つもない場合のみ、直接スタート（No Data表示）を呼びます
            startMainCountdown();
        }
    }
}

window.addEventListener("hashchange", handleHash);

// 起動時にハッシュを確認して、何を表示するか決定します
window.addEventListener("load", () => {
    handleHash();
});

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
    // メニューを開く時、保存されているリストを最新の状態にして表示します。
    refreshMenuList();
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

    // モーダルを表示状態にする
    overlay.classList.add("visible");
    createModal.classList.add("open");
    
    // 中身の構築中にLoadingを表示します
    ui.showModalLoading();

    setTimeout(() => {
        // 初めて開く際、またはまだ中身が空の場合にのみ初期化を行います
        const createDatePicker = document.getElementById("create-date-picker");
        if (createDatePicker.children.length === 0) {
            ui.resetCreateModal();
            createDefaultDateModal();
        }
        
        // 初期化が終わったらLoadingを隠します
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
        extractDataFromFields(fields);
    })
}

function extractDataFromFields(fields) {
    // fieldsからタイトル、日時などのデータを抽出します。
    // データの取得
    const countTitleObject = fields.find(item => item.type === "title");
    const countDatetimeObject = fields.find(item => item.type === "datetime");

    console.log(`タイトル：${countTitleObject.getValue()}\n日時：${countDatetimeObject.getValue()}`);

    if (countTitleObject.getValue() && countDatetimeObject.getValue()) {
        console.log("条件を満たしている");

        console.log("これがfp.selectedDates[0]")
        console.log(countDatetimeObject.getValue());
        console.log("")
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
    previewDatetime.textContent = `終了日時：${data.datetime.getFullYear()}年${data.datetime.getMonth() + 1}月${data.datetime.getDate()}日${data.datetime.getHours()}時${data.datetime.getMinutes()}分`

    // ボタンのイベントリスナーが重複しないように、要素ごと新しく作り替えます（クローン）
    const newAddBtn = previewAddButton.cloneNode(true);
    const newCancelBtn = previewCancelButton.cloneNode(true);
    previewAddButton.parentNode.replaceChild(newAddBtn, previewAddButton);
    previewCancelButton.parentNode.replaceChild(newCancelBtn, previewCancelButton);

    setTimeout(() => {
        // 初期化
        let count = countdown.calcRemainingTime(data.datetime);
        ui.updatePreviewCount(count);

        previewModal.classList.add("open");

        stop = countdown.startAccurateTimer(() => {
            count = countdown.calcRemainingTime(data.datetime);
            ui.updatePreviewCount(count);
        })

        // キャンセルボタン（プレビューを閉じて作成画面に戻す）
        newCancelBtn.addEventListener("click", () => {
            console.log("作成画面に戻ります");
            stop(); // プレビュー用のタイマーを停止
            previewModal.classList.remove("open");
            // 作成画面（モーダル）を再表示します
            createModal.classList.add("open");
        }, {once: true});

        // 追加ボタン（データを保存してメイン表示を切り替える）
        newAddBtn.addEventListener("click", (e) => {
            stop(); // プレビュー用のタイマーを停止
            const previewModal = document.getElementById("preview-modal");
            previewModal.classList.remove("open");
            
            // データを保存し、新しいIDを受け取ります
            const newId = countdown.addCountdown(data);
            
            // 入力フォームを次回の為にリセットします
            ui.resetCreateModal();
            
            // 新しく作成されたIDのページへ遷移します（ハッシュを更新）
            location.hash = `#id=${newId}`;
            
            // メニューリストも最新の状態にします
            refreshMenuList();
        }, {once: true})
    }, 500)
}

// --- メイン画面の表示管理 ---

// メイン画面のタイマーを止めるための関数を保持します
let mainTimerStop = null;

// 現在メイン画面に表示しているカウントダウンのIDを保持します
// これにより、メニュー内での「選択中」スタイルの適用やリストの切り替えが可能になります
let currentCountdownId = null;

/**
 * メイン画面のカウントダウンを開始します。
 * @param {string} [id] - 表示したい特定のカウントダウンID。省略時は一番上のものを表示。
 */
export function startMainCountdown(id = null) {
    const list = countdown.getCountdowns();
    const countContainer = document.querySelector(".count-container");
    
    // 保存されたデータがない場合は、メッセージを表示して終了します
    if (list.length === 0) {
        if (countContainer) countContainer.classList.add("is-empty");
        if (mainTimerStop) mainTimerStop();
        
        // ボタンのテキストもリセットしておきます
        const buttonText = document.getElementById("dropdown-button")?.querySelector(".dropdown-button-text");
        if (buttonText) buttonText.textContent = "TickLife";
        return;
    }

    // データがある場合は、メッセージを隠してカウント表示を有効にします
    if (countContainer) countContainer.classList.remove("is-empty");

    // IDが指定されていればそれを、なければリストの先頭を使います
    let data = null;
    if (id) {
        data = list.find(item => item.id === id);
    }
    
    // 万が一IDが見つからなかった、または最初から指定がなかった場合
    if (!data) {
        data = list[0];
    }

    // 重複して状態を更新しないようチェックします
    if (currentCountdownId === data.id && mainTimerStop) return;

    currentCountdownId = data.id;

    // ヘッダーのドロップダウンボタンに表示されるテキストを、カウントダウンのの名前に変更します
    const buttonText = document.getElementById("dropdown-button")?.querySelector(".dropdown-button-text");
    if (buttonText) buttonText.textContent = data.title;

    // もし既にタイマーが動いていたら、二重に動かないように一旦止めます
    if (mainTimerStop) mainTimerStop();

    // 1秒ごとに画面を書き換えるタイマーを開始します
    mainTimerStop = countdown.startAccurateTimer(() => {
        updateMainDisplay(data.targetDatetime);
    });

    // タイマーの開始を待たずに、今すぐ一回表示を更新します
    updateMainDisplay(data.targetDatetime);
}

/**
 * メニューの中にあるカウントダウンリストを最新の状態に更新します。
 */
function refreshMenuList() {
    const listContainer = document.getElementById("menu-list");
    const list = countdown.getCountdowns();

    // ui.js の関数を呼び出してリストを生成します
    // 選択時の処理 (onSelect) と 削除時の処理 (onDelete) を渡します
    ui.renderCountdownList(listContainer, list, currentCountdownId, (selectedId) => {
        // --- 選択時の処理 ---
        console.log("選択されました ID:", selectedId);
        
        // メイン表示を切り替えるためにハッシュを更新します（これで戻るボタンが効くようになります）
        location.hash = `#id=${selectedId}`;
        closeMenu();
    }, (deletedId) => {
        // --- 削除時の処理 ---
        // 確認ダイアログを出してから削除を実行します
        if (confirm("このカウントダウンを削除しますか？")) {
            countdown.deleteCountdown(deletedId);
            
            // もし削除したのが今表示しているものだったら、表示を初期化（別のものに切り替え）します
            if (deletedId === currentCountdownId) {
                // タイマーを止めてIDをリセットしてから再開します
                if (mainTimerStop) mainTimerStop();
                mainTimerStop = null;
                currentCountdownId = null;
                startMainCountdown();
            }
            
            // リストを再描画します
            refreshMenuList();
        }
    });
}

/**
 * メイン画面の数値を更新し、プレビューと同じボックス形式で表示します。
 * @param {string} targetTime - 終了日時のISO文字列
 */
function updateMainDisplay(targetTime) {
    const remaining = countdown.calcRemainingTime(targetTime);
    
    // メイン画面の表示コンテナを取得します
    const container = document.querySelector(".main-count-display");
    
    // ui.js で作成した汎用的な更新関数を呼び出します
    if (container) {
        ui.updateCountDisplay(remaining, container);
    }
}

// 三点メニュー（詳細設定など）のクリック処理
const detailMenuButton = document.querySelector(".detail-dropdown-button");
if (detailMenuButton) {
    detailMenuButton.addEventListener("click", () => {
        alert("この機能は開発中です。");
    });
}

// --- ダークモードの設定 ---
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