eruda.init();

////// Sending and receiving joins from processor
//// Digital
const sendDigitalButton = document.getElementById("sendDigitalButton");
const currentDigitalValue = document.getElementById("currentDigitalValue");
let savedBoolean = false;

// Receive
window.CrComLib.subscribeState('b', '1', (value) => {
    savedBoolean = value;
    currentDigitalValue.innerText = value.toString();
});

sendDigitalButton.addEventListener('click', handleSendDigital);

// Send
function handleSendDigital() {
    window.CrComLib.publishEvent('b', '1', !savedBoolean);
}

//// Analog
const sendAnalogButton = document.getElementById("sendAnalogButton");
const currentAnalogValue = document.getElementById("currentAnalogValue");
const analogSlider = document.getElementById("analogSlider");

// Receive
window.CrComLib.subscribeState('n', "1", (value) => { 
    let stringValue = value.toString();
    currentAnalogValue.innerText = stringValue;
    analogSlider.value = stringValue;
});

analogSlider.addEventListener('input', handleSliderChange);
sendAnalogButton.addEventListener('click', handleSendAnalog);

function handleSliderChange() {
    currentAnalogValue.innerText = analogSlider.value;
};

// Send
function handleSendAnalog() {
    window.CrComLib.publishEvent('n', '1', parseInt(analogSlider.value, 10));
}

//// Serial
const sendSerialButton = document.getElementById("sendSerialButton");
const currentSerialValue = document.getElementById("currentSerialValue");

// Receive
window.CrComLib.subscribeState('s', "1", (value) => {
    currentSerialValue.value = value;
});

sendSerialButton.addEventListener('click', handleSendSerial);
currentSerialValue.onkeydown = function(e) {
    let keyCode = e.code || e.key;

    if (keyCode == 'Enter') {
        handleSendSerial();
        return false;
    }
}

// Send
function handleSendSerial() {
    window.CrComLib.publishEvent('s', '1', currentSerialValue.value);
}