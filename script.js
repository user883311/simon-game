var buttons = [0, 1, 2, 3];
var machineSeq = humanSeq = []; // [2, 0, 3, 2, 1, 4]
var count = 0;
var win = 20;
var strict = false; // toggle
var buttonsActive = false;
var mistake = 0;
var on = false;
document.onreadystatechange = function () {
    if (this.readyState == "complete") {
        document.getElementById("on-off-checkbox").checked = false;
    }
}

// SOUNDS : source https://freesound.org/ 
// E-note (green, upper left, an octave lower than blue);
// A-note (red, upper right).
// E-note (blue, lower right);
// C♯-note (yellow, lower left);
var green_note_e2 = new Audio("sounds/e2.wav"); // buffers automatically when created
var red_note_a = new Audio("sounds/a.wav");
var blue_note_e3 = new Audio("sounds/e3.wav");
var yellow_note_c = new Audio("sounds/c.wav");
var soundsArr = [green_note_e2, red_note_a, yellow_note_c, blue_note_e3];


// FUNCTIONS
async function start() {
    if (on === false) { return 0 };
    reset();
    await sleep(1000);
    nextMachineSeq();
    buttonsActive = true;
}

function setStrict() {
    if (on === false || machineSeq.length != 0) { return 0 };
    if (strict) {
        document.getElementById("strict-mode-led").classList.remove("led-on");
        strict = false;
    }
    else {
        document.getElementById("strict-mode-led").classList.add("led-on");
        strict = true;
    }
}

function onOff() {
    on = on ? false : true;
    count = 0;
    if (on) {
        document.getElementById("display-panel").classList.remove("invisible-text");
        document.getElementById("display-panel").textContent = (count < 10) ? "0" + count.toString() : count.toString();
        strict = false;
        document.getElementById("strict-mode-led").classList.remove("led-on");
        reset();
    }
    else {
        document.getElementById("display-panel").classList.add("invisible-text");
        strict = false;
        document.getElementById("strict-mode-led").classList.remove("led-on");

    }
}

async function humanPlays(intBtnValue) {
    if (on === false) { return 0 };

    // console.log("Human plays", intBtnValue);
    if (buttonsActive) {
        humanSeq.push(intBtnValue);
        
        // Stop taking input if pressed enough
        if (humanSeq.length === machineSeq.length) { buttonsActive = false }
        
        soundsArr[intBtnValue].play();
        await sleep(1000);
        // console.log("Human seq = ", humanSeq);
        if (arraysEqual(humanSeq, machineSeq.slice(0, humanSeq.length))) {
            // console.log("So far humanSeq === machineSeq...");

            if (arraysEqual(humanSeq, machineSeq)) {
                count++;
                if (count === win) { gameWon(); }
                else {
                    
                    // console.log("Good, let's go to round#" + count);
                    document.getElementById("display-panel").textContent = (count < 10) ? "0" + count.toString() : count.toString();
                    // console.log("count =", count);
                    await sleep(1000);
                    nextMachineSeq();
                }
            }
        }
        else {
            buttonsActive = false;
            // console.log("Player made a mistake.");
            document.getElementById("display-panel").textContent = "!!";
            await sleep(2000);
            document.getElementById("display-panel").textContent = (count < 10) ? "0" + count.toString() : count.toString();
            if (strict === false && mistake < 1) {
                mistake++;
                playSequence();
                humanSeq = []; // reset
                buttonsActive = true;
            }
            else { gameLost(); }
        }
    }
}

function nextMachineSeq() {
    // console.log("calling nextMachineSeq()");
    buttonsActive = false;
    let nextBtn = Math.trunc(Math.random() * buttons.length);
    machineSeq.push(buttons[nextBtn]);
    // console.log("Machine sequence is now", machineSeq);
    playSequence(machineSeq);
    humanSeq = []; // reset
    buttonsActive = true;
}

async function playSequence() {
    buttonsActive = false;
    for (i = 0; i < machineSeq.length; i++) {
        // console.log("machine sounds :" , machineSeq[i]);
        document.getElementById("button" + machineSeq[i]).classList.add("machine-pressed");
        soundsArr[machineSeq[i]].play();
        await sleep(1000);
        document.getElementById("button" + machineSeq[i]).classList.remove("machine-pressed");
        await sleep(500);
    }
}

function reset() {
    if (on === false) { return 0 };
    buttonsActive = false;
    count = 0;
    machineSeq = [];
    humanSeq = [];
    mistake = 0;    
    let displayCount = (count.toString().length === 1) ? "0" + count.toString() : count.toString();
    document.getElementById("display-panel").textContent = displayCount;
}

async function gameWon() {
    // console.log("It's a WIN !");
    document.getElementById("display-panel").textContent = "**";
    buttonsActive = false;
    await sleep(2000);

    reset();
    start();
}

function gameLost() {
    // console.log("It's a LOSS !");
    reset();
    start();
}

function arraysEqual(a, b) {
    // Source: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript#16436975
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Implemented with arraysSameElements(a, b)

    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function arraysSameElements(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    a.sort();
    b.sort();
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function sleep(ms) {
    /* To be used in async function with : 
    await sleep(2000); */
    return new Promise(resolve => setTimeout(resolve, ms));
}