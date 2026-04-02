const countdowns = []

export function countdownPreview(data) {
    
}

export function addCountdowns(data) {
    console.log(data)
}

function generateRandomID(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}