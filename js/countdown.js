// カウントダウンデータを保持する配列。
// 初期化時にLocalStorageからデータを読み込みますが、最初は空配列で定義します。
let countdowns = [];

// LocalStorageにデータを保存する際に使用するキー名です。
const STORAGE_KEY = "ticklife_countdowns";

/**
 * LocalStorageからデータを読み込み、内部の配列を更新します。
 */
export function loadData() {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        // データが存在すればパースして配列に入れ、なければ空配列にします。
        countdowns = json ? JSON.parse(json) : [];
        console.log("データの読み込みが完了しました:", countdowns);
    } catch (e) {
        console.error("データの読み取り中にエラーが発生しました:", e);
        countdowns = [];
    }
    return countdowns;
}

/**
 * 内部の配列（countdowns）をLocalStorageに保存します。
 */
export function saveData() {
    try {
        const json = JSON.stringify(countdowns);
        localStorage.setItem(STORAGE_KEY, json);
        console.log("データをLocalStorageに保存しました。");
    } catch (e) {
        console.error("データの保存中にエラーが発生しました:", e);
    }
}

/**
 * 新しいカウントダウンを追加して保存します。
 * @param {Object} data - タイトルと日時（Dateオブジェクト）を含むデータ
 */
export function addCountdown(data) {
    // データの作成
    const id = generateRandomID(10); // IDを少し長く設定しました（衝突回避のため）
    const title = data.title;
    
    // 日時は文字列（ISO形式）に変換して保存します。
    // そのまま保存すると、後で読み込んだ時にDateオブジェクトではなく文字列になってしまうため注意が必要です。
    const ISOTargetDatetime = data.datetime.toISOString();
    const ISONowDatetime = new Date().toISOString();

    const formattedData = {
        id: id,
        title: title,
        targetDatetime: ISOTargetDatetime,
        createdAt: ISONowDatetime,
        lastAccessTime: ISONowDatetime
    };

    // 配列に追加して、LocalStorageに書き込みます。
    countdowns.push(formattedData);
    saveData();
    
    console.log("新しいカウントダウンを追加しました:", formattedData);
    
    // 生成されたIDを返します（作成直後にその項目を表示するため）
    return id;
}

/**
 * 指定されたIDのカウントダウンを削除し、保存します。
 * @param {string} id - 削除するカウントダウンのID
 */
export function deleteCountdown(id) {
    // 指定されたIDを除外した新しい配列を作成します。
    countdowns = countdowns.filter(item => item.id !== id);
    saveData();
    console.log(`ID: ${id} のカウントダウンを削除しました。`);
}

/**
 * 現在保持しているカウントダウンのリストを返します。
 * @returns {Array} カウントダウンデータの配列
 */
export function getCountdowns() {
    return countdowns;
}

// モジュールの読み込み時に一度だけ自動的にデータを読み込みます。
loadData();

/**
 * ランダムなIDを生成します。
 * @param {number} length - 生成する文字列の長さ
 * @returns {string} ランダムな文字列
 */
function generateRandomID(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * 残り時間を計算してオブジェクトとして返します。
 * @param {string|Date} time - ターゲットとなる日時
 * @returns {Object} 残り時間のデータ（yrs, day, hrs, min, sec）
 */
export function calcRemainingTime(time) {
    // 文字列で渡された場合はDateオブジェクトに変換します。
    const targetTime = new Date(time);
    const currentTime = new Date();

    // 既に時間が過ぎている場合
    if (targetTime <= currentTime) {
        return {
            yrs: 0,
            day: 0,
            hrs: 0,
            min: 0,
            sec: 0
        };
    }

    // 外部ライブラリ countdown.js を使用して計算（index.htmlで読み込まれています）
    // UIに「月」のボックスがないため、月を計算に含めず、すべて「日」に合算されるように単位を指定します。
    const result = countdown(
        targetTime, 
        currentTime, 
        countdown.YEARS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS
    );

    return {
        yrs: result.years || 0,
        day: result.days || 0,
        hrs: result.hours || 0,
        min: result.minutes || 0,
        sec: result.seconds || 0
    };
}

/**
 * 高精度なタイマーを開始します（毎秒実行用）。
 * @param {Function} callback - 実行したい関数
 * @returns {Function} タイマーを停止するための関数
 */
export function startAccurateTimer(callback) {
    let stop = false;

    function tick() {
        if (stop) return;

        const now = Date.now();
        // 次の「秒」の変わり目までの時間を計算して、できるだけ正確に1秒ピッチで動かします。
        const delay = 1000 - (now % 1000);

        setTimeout(() => {
            // もし待機中にタイマーが停止されていたら、以降の処理を行わず終了します。
            // これにより、古いタイマーと新しいタイマーが混ざるのを防ぎます。
            if (stop) return;

            callback();
            tick();
        }, delay);
    }

    tick();

    // この関数を呼ぶとタイマーが止まるようになります。
    return () => {
        stop = true;
    };
}