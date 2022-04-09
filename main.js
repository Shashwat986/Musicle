/*
const VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".
var vf = new VF.Factory({renderer: {elementId: 'stave'}});
var score = vf.EasyScore();
var system = vf.System();

system.addStave({
    //voices: [score.voice(score.notes('C#5/q, B4, A4, G#4'))]
    voices: [score.voice(score.notes('E5/8, E5/r, E5/r, C4, E5/q'))]
}).addClef('treble').addTimeSignature('4/4');

vf.draw();
*/

var abcString = "T: Cooley's\n" +
"M: 4/4\n" +
"L: 1/8\n" +
"R: reel\n" +
"K: Emin\n" +
"|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\n" +
"EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|\n" +
"|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|\n" +
"eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:| D4 ||";


var visualObj = ABCJS.renderAbc("paper", abcString, {
    responsive: "resize"
});

function CursorControl(rootSelector) {
    // This demonstrates two methods of indicating where the music is.
    // 2) The currently being played note is given a class so that it can be transformed.
    this.rootSelector = rootSelector; // This is the same selector as the renderAbc call uses.

    this.onStart = function() {
        // This is called when the timer starts so we know the svg has been drawn by now.
    };

    this.removeSelection = function() {
        // Unselect any previously selected notes.
        var lastSelection = document.querySelectorAll(this.rootSelector + " .abcjs-highlight");
        for (var k = 0; k < lastSelection.length; k++) {
            lastSelection[k].setAttribute('fill', "currentColor")
            lastSelection[k].classList.remove("abcjs-highlight");
        }
    };


    this.onEvent = function(ev) {
        // This is called every time a note or a rest is reached and contains the coordinates of it.
        if (ev.measureStart && ev.left === null)
            return; // this was the second part of a tie across a measure line. Just ignore it.

        this.removeSelection();

        // Select the currently selected notes.
        for (var i = 0; i < ev.elements.length; i++ ) {
            var note = ev.elements[i];
            for (var j = 0; j < note.length; j++) {
                note[j].classList.add("abcjs-highlight");
                note[j].setAttribute('fill', "red");
            }
        }
    };
    this.onFinished = function() {
        this.removeSelection();
    };
}

var cursorControl = new CursorControl("#paper");

document.querySelector(".activate-audio").addEventListener("click", activate);

function activate() {
    if (ABCJS.synth.supportsAudio()) {
        var controlOptions = {
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayClock: true
        };
        var synthControl = new ABCJS.synth.SynthController();
        synthControl.load("#audio", cursorControl, controlOptions);
        synthControl.disable(true);
        var midiBuffer = new ABCJS.synth.CreateSynth();
        midiBuffer.init({
            visualObj: visualObj[0],
            options: {

            }

        }).then(function () {
            synthControl.setTune(visualObj[0], true).then(function (response) {
            document.querySelector(".abcjs-inline-audio").classList.remove("disabled");
            })
        });
    } else {
        console.log("audio is not supported on this browser");
    };
}
