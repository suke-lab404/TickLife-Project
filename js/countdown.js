const countdowns = []

export function addCountdown(data) {
    // データの作成
    const id = generateRandomID(5);
    const title = data.title;
    console.log(data.datetime)
    const ISOTargetDatetime = data.datetime.toISOString();
    // 現在の日時の保存
    const ISONowDatetime = new Date().toISOString();

    const formattdData = {
        id: id,
        title: title,
        targetDatetime: ISOTargetDatetime,
        lastAccessTime: ISONowDatetime
    };

    saveData();
}

export function saveData() {

}

function generateRandomID(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function calcRemainingTime(time) {
    const targetTime = new Date(time);
    const currentTime = new Date();

    if (targetTime <= currentTime) {
        console.log("あらもう過ぎているじゃない。遅刻わよ")

        const countData = {
            yrs: 0,
            day: 0,
            hrs: 0,
            min: 0,
            sec: 0
        }

        return countData;
    }

    const result = countdown(
        targetTime,
        currentTime
    )

    const yrs = result.years;
    const day = result.days;
    const hrs = result.hours;
    const min = result.minutes;
    const sec = result.seconds;

    const countData = {
        yrs: yrs,
        day: day,
        hrs: hrs,
        min: min,
        sec: sec
    };

    return countData;
}

export function startAccurateTimer(callback) {
    function tick() {
        const now = Date.now();

        const delay = 1000 - (now % 1000);

        setTimeout(() => {
            callback();
            if (stop === false) {
                tick();
            }
        }, delay);
    }

    let stop = false;
    tick();

    return () => {
        stop = true;
    }
}