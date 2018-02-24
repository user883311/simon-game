var buttons = [0, 1, 2, 3];
var machineSeq = humanSeq = []; // [2, 0, 3, 2, 1, 4]
var count = 0;
var win = 20;
var strict = false; // toggle
var buttonsActive = false;
var mistake = 0;

// SOUNDS
// E-note (blue, lower right);
// C♯-note (yellow, lower left);
// A-note (red, upper right).
// E-note (green, upper left, an octave lower than blue);

function start() {
    console.log("Starting...");
    console.log("stric mode?", strict);
    nextMachineSeq();
    buttonsActive = true;
}

function humanPlays(intBtnValue) {
    console.log("Human plays", intBtnValue);
    if (buttonsActive) {
        humanSeq.push(intBtnValue);
        console.log("Human seq = ", humanSeq);
        if (arraysEqual(humanSeq, machineSeq.slice(0, humanSeq.length))) {
            console.log("So far humanSeq === machineSeq...");

            if (arraysEqual(humanSeq, machineSeq)) {
                if (count === win) {gameWon();}
                else {
                    console.log("Good, let's go to round#"+count);
                    count++;
                    console.log("count =", count);
                    nextMachineSeq();
                }
            }
        }
        else {
            console.log("There was a mistake");
            if (strict === false && mistake < 1) {
                mistake++;
                playSequence();
                humanSeq = []; // reset
            }
            else { gameLost(); }
        }
    }
}

function nextMachineSeq() {
    buttonsActive = false;
    let nextBtn = Math.trunc(Math.random() * buttons.length);
    machineSeq.push(buttons[nextBtn]);
    console.log("Machine sequence", machineSeq);
    playSequence(machineSeq);
    humanSeq = []; // reset
    buttonsActive = true;
}

function playSequence() {
    for (i = 0; i < machineSeq.length; i++) {
        console.log(machineSeq[i]);
    }
}

function reset() {
    buttonsActive = false;
    count = 0;
    machineSeq = [];
    humanSeq = [];
    mistake = 0;
    start();
}

function gameWon() {
    console.log("It's a WIN !");
    reset();
}

function gameLost() {
    console.log("It's a LOSS !");
    reset();
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