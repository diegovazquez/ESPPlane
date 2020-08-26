/* ------------------------------------------------------------------------------------------ */
// Config
/* ------------------------------------------------------------------------------------------ */
if (typeof config == "undefined") { config = function() {} }


/* ------------------------------------------------------------------------------------------ */
// Tools
/* ------------------------------------------------------------------------------------------ */
if (typeof tools == "undefined") { tools = function() {} }

tools.cicleCoordsToScuareCoords = function(x, y) {
  // Transform to scuare
  u2 = x * x;
  v2 = y * y;
  twosqrt2 = 2.0 * Math.sqrt(2.0);
  subtermx = 2.0 + u2 - v2;
  subtermy = 2.0 - u2 + v2;
  termx1 = subtermx + x * twosqrt2;
  termx2 = subtermx - x * twosqrt2;
  termy1 = subtermy + y * twosqrt2;
  termy2 = subtermy - y * twosqrt2;
  if ( termx1 < 0) { termx1 = 0}
  if ( termx2 < 0) { termx2 = 0}
  if ( termy1 < 0) { termy1 = 0}
  if ( termy2 < 0) { termy2 = 0}
  u = 0.5 * Math.sqrt(termx1) - 0.5 * Math.sqrt(termx2);
  v = 0.5 * Math.sqrt(termy1) - 0.5 * Math.sqrt(termy2);
  if ( u > 1) { u = 1}
  if ( u < -1) { u = -1}
  if ( v > 1) { v = 1}
  if ( v < -1) { v = -1}
  return [u, v]
}


/* ------------------------------------------------------------------------------------------ */
// Touch Controls
/* ------------------------------------------------------------------------------------------ */
if (typeof touch == "undefined") { touch = function() {} }

touch.control1 = nipplejs.create({
    mode: 'dynamic',
    zone: document.getElementById('control1'),
    color: 'blue',
    size: 150,
    multitouch: true
});

touch.control2 = nipplejs.create({
    mode: 'dynamic',
    zone: document.getElementById('control2'),
    color: 'blue',
    size: 150,
    multitouch: true
});

/* ------------------------------------------------------------------------------------------ */
// Gamepad
/* ------------------------------------------------------------------------------------------ */
if (typeof gamepad == "undefined") { gamepad = function() {} }

gamepad.buttonFadeTime = 200
gamepad.isEnabled = false

document.getElementById("btnJoystick").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    if (gamepad.isEnabled == false) {
      console.log("Gamepad Enabled")
      gamepad.enabled();
    } else {
      console.log("Gamepad Disabled")
      gamepad.disable();
    }
  }
});

gamepad.enabled = function() {
  document.getElementById("btnJoystick").style.backgroundColor = ui.btnActiveColor;
  document.getElementById("joystick1").style.display = 'inherit';
  document.getElementById("joystick2").style.display = 'inherit';
  gamepad.isEnabled = true;

  if (config.gamepadAxis12FeedbackStyle === 'Circle') {
    document.getElementById("joystick1").style.borderRadius = "75px";
  }
  if (config.gamepadAxis12FeedbackStyle === 'Square') {
    document.getElementById("joystick1").style.borderRadius = "8px";
  }
  if (config.gamepadAxis12FeedbackStyle === 'PowerStick') {
    document.getElementById("joystick1").style.borderRadius = "8px";
    document.getElementById("joystickFeedback1").style.left = "50%";
    document.getElementById("joystickFeedback1").style.top = "100%";
  }

  if (config.gamepadAxis34FeedbackStyle === 'Circle') {
    document.getElementById("joystick2").style.borderRadius = "75px";
  }
  if (config.gamepadAxis34FeedbackStyle === 'Square') {
    document.getElementById("joystick2").style.borderRadius = "8px";
  }
  if (config.gamepadAxis34FeedbackStyle === 'PowerStick') {
    document.getElementById("joystick2").style.borderRadius = "8px";
    document.getElementById("joystickFeedback2").style.left = "50%";
    document.getElementById("joystickFeedback2").style.top = "100%";
  }
}

gamepad.disable = function() {
  document.getElementById("btnJoystick").style.backgroundColor = ui.btnInactiveColor;
  document.getElementById("joystick1").style.display = 'none';
  document.getElementById("joystick2").style.display = 'none';
  gamepad.isEnabled = false;
}

joypad.on('connect', e => {
  const { id } = e.gamepad;
  console.log(`${id} connected!`);
});

joypad.on('button_press', e => {
  if (ui.areBtnsLocked  == false) {
    if (gamepad.isEnabled) {
      const { buttonName } = e.detail;
      console.log(`${buttonName} was pressed!`);
      
      // -----------------------------------------
      if (buttonName == config.gamepadPanel1BottomTrimPlus) {
        trim.plusControl1BottomVal();
      }
      if (buttonName == config.gamepadPanel1BottomTrimMinus) {
        trim.minusControl1BottomVal();
      }
      if (buttonName == config.gamepadPanel1TopTrimMinus) {
        trim.minusControl1TopVal();
      }
      if (buttonName == config.gamepadPanel1TopTrimPlus) {
        trim.plusControl1TopVal();
      }
      // -----------------------------------------
      if (buttonName == config.gamepadPanel3BottomTrimPlus) {
        trim.plusControl3BottomVal();
      }
      if (buttonName == config.gamepadPanel3BottomTrimMinus) {
        trim.minusControl3BottomVal();
      }
      if (buttonName == config.gamepadPanel3TopTrimMinus) {
        trim.minusControl3TopVal();
      }
      if (buttonName == config.gamepadPanel3TopTrimPlus) {
        trim.plusControl3TopVal();
      }
      
    }
  }
});

gamepad.axisToCSS = function(x,y, style) {
  if (style === 'Circle') {
    x = ((x * 100)/2)+50
    y = ((y * 100)/2)+50
    return [x, y];
  }
  if (style === 'Square') {  
    // Transform to scuare
    u = tools.cicleCoordsToScuareCoords(x, y)[0] 
    v = tools.cicleCoordsToScuareCoords(x, y)[1]
    
    // Transform to CSS
    u = ((u * 100)/2)+50
    v = ((v * 100)/2)+50
    return [u, v];
  }
  if (style === 'PowerStick') {
    // Transform to scuare
    u = tools.cicleCoordsToScuareCoords(x, y)[0] 
    v = tools.cicleCoordsToScuareCoords(x, y)[1]
    
    // Transform to CSS
    u = ((u * 100)/2)+50
    v = ((v * 100))+100
    if ( v > 100){ v = 100 }
    return [u, v];
  }
}; 

gamepad.joypadLoop = function() {
  if (gamepad.isEnabled) {
    axisValues = false
    var i;
    for (i = 0; i < 10; i++) {
      if (typeof joypad.instances[i] !== "undefined") { 
        axisValues = joypad.instances[i].axes; 
        break;
      };
    }
    if (axisValues !== false){
      /* -- Stick 1 -- */
      if (config.gamepadAxis12FeedbackStyle === 'Circle') {
        document.getElementById("joystickFeedback1").style.left = gamepad.axisToCSS(axisValues[0], axisValues[1], 'Circle')[0] + "%";
        document.getElementById("joystickFeedback1").style.top = gamepad.axisToCSS(axisValues[0], axisValues[1], 'Circle')[1] + "%";
      }
      if (config.gamepadAxis12FeedbackStyle === 'Square') {
        document.getElementById("joystickFeedback1").style.left = gamepad.axisToCSS(axisValues[0], axisValues[1], 'Square')[0] + "%";
        document.getElementById("joystickFeedback1").style.top = gamepad.axisToCSS(axisValues[0], axisValues[1], 'Square')[1] + "%";
      }
      if (config.gamepadAxis12FeedbackStyle === 'PowerStick') {
        document.getElementById("joystickFeedback1").style.left = gamepad.axisToCSS(axisValues[0], axisValues[1], 'PowerStick')[0] + "%";
        document.getElementById("joystickFeedback1").style.top = gamepad.axisToCSS(axisValues[0], axisValues[1], 'PowerStick')[1] + "%";
      }      
      /* -- Stick 2 -- */
      if (config.gamepadAxis34FeedbackStyle === 'Circle') {
        document.getElementById("joystickFeedback2").style.left = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Circle')[0] + "%";
        document.getElementById("joystickFeedback2").style.top = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Circle')[1] + "%";  
      }
      if (config.gamepadAxis34FeedbackStyle === 'Square') {
        document.getElementById("joystickFeedback2").style.left = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Square')[0] + "%";
        document.getElementById("joystickFeedback2").style.top = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Square')[1] + "%";  
      }
      if (config.gamepadAxis34FeedbackStyle === 'PowerStick') {
        document.getElementById("joystickFeedback2").style.left = gamepad.axisToCSS(axisValues[2], axisValues[3], 'PowerStick')[0] + "%";
        document.getElementById("joystickFeedback2").style.top = gamepad.axisToCSS(axisValues[2], axisValues[3], 'PowerStick')[1] + "%";  
      }
    }
  };
}; 
setInterval(gamepad.joypadLoop, 33);

/* ------------------------------------------------------------------------------------------ */
// UI
/* ------------------------------------------------------------------------------------------ */
if (typeof ui == "undefined") { ui = function() {} }

ui.btnActiveColor = 'blue'
ui.btnInactiveColor = "rgb(41, 41, 61)";
ui.btnDisableColor = "rgb(16, 14, 35)";

ui.buttonAnimation = function(id) {
  document.getElementById(id).style.backgroundColor = ui.btnActiveColor;
  setInterval(function(){
    document.getElementById(id).style.backgroundColor = ui.btnInactiveColor;
  }, gamepad.buttonFadeTime);
}; 

/* UI Lock */
ui.areBtnsLocked = false

ui.unlockBtns = function() {
  ui.areBtnsLocked = true;
}

ui.lockBtns = function() {
  ui.areBtnsLocked = false;
}

document.getElementById("btnLockMenu").addEventListener("click", function() {
  if (ui.areBtnsLocked  == false) {
    console.log("Buttons Loked")
    document.getElementById("btnLockMenu").style.backgroundColor = ui.btnActiveColor
    ui.unlockBtns();
  } else {
    console.log("Buttons Unlocked")
    document.getElementById("btnLockMenu").style.backgroundColor = ui.btnInactiveColor
    ui.lockBtns();
  }
});

/* UI Lock  */
ui.fullscreen = false

ui.openFullscreen = function() {
  var elem = document.documentElement;
  ui.fullscreen = true
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

ui.closeFullscreen = function() {
  var elem = document.documentElement;
  ui.fullscreen = false
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
} 

document.getElementById("btnFullScreen").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    if (ui.fullscreen == false) {
      console.log("Open Fullscreen")
      document.getElementById("btnFullScreen").style.backgroundColor = ui.btnActiveColor
      ui.openFullscreen();
    } else {
      console.log("Close Fullscreen")
      document.getElementById("btnFullScreen").style.backgroundColor = ui.btnInactiveColor
      ui.closeFullscreen();
    }
  }
});

document.getElementById("trimCol1TopLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl1TopVal()
  }
});
document.getElementById("trimCol1TopRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl1TopVal()
  }
});
document.getElementById("trimCol1BottomLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl1BottomVal()
  }
});
document.getElementById("trimCol1BottomRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl1BottomVal()
  }
});


document.getElementById("trimCol3TopLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl3TopVal()
  }
});
document.getElementById("trimCol3TopRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl3TopVal()
  }
});
document.getElementById("trimCol3BottomLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl3BottomVal()
  }
});
document.getElementById("trimCol3BottomRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl3BottomVal()
  }
});


/* ------------------------------------------------------------------------------------------ */
// TRIM
/* ------------------------------------------------------------------------------------------ */

if (typeof trim == "undefined") { trim = function() {} }

trim.control1TopVal = 0
trim.control1BottomVal = 0
trim.control2TopVal = 0
trim.control2BottomVal = 0

trim.plusControl1TopVal = function(val) {
  console.log("Panel 1 - Trim Top +")
  ui.buttonAnimation("trimCol1TopRight");
}
trim.minusControl1TopVal = function(val) {
  console.log("Panel 1 - Trim Top -")
  ui.buttonAnimation("trimCol1TopLeft");
}

trim.plusControl1BottomVal = function(val) {
  console.log("Panel 1 - Trim Bottom +")
  ui.buttonAnimation("trimCol1BottomRight");
}
trim.minusControl1BottomVal = function(val) {
  console.log("Panel 1 - Trim Bottom -")
  ui.buttonAnimation("trimCol1BottomLeft"); 
}

trim.plusControl3TopVal = function(val) {
  console.log("Panel 3 - Trim Top +")
  ui.buttonAnimation("trimCol3TopRight");
}
trim.minusControl3TopVal = function(val) {
  console.log("Panel 3 - Trim Top -")
  ui.buttonAnimation("trimCol3TopLeft");
}

trim.plusControl3BottomVal = function(val) {
  console.log("Panel 3 - Trim Bottom +")
  ui.buttonAnimation("trimCol3BottomRight");
}
trim.minusControl3BottomVal = function(val) {
  console.log("Panel 3 - Trim Bottom -")
  ui.buttonAnimation("trimCol3BottomLeft");
}

/* ------------------------------------------------------------------------------------------ */
// WebSocket
/* ------------------------------------------------------------------------------------------ */

//var connection = new WebSocket('ws://' + location.hostname + ':81/', ['arduino']);
var websocket = new WebSocket('ws://192.168.0.191:81/', ['arduino']);

websocket.latencyTestLoopEvery = 500      //Miliseconds
websocket.latencyTestLoopEnabled = true;


websocket.onopen = function () {
    console.log("WebSocket Connected");
};
websocket.onerror = function (error) {
    console.log('WebSocket Error ', error);
};
websocket.onmessage = function (e) {
    data = JSON.parse(e.data);

    if (data.hasOwnProperty("wifiSignalPercentual")){
      document.getElementById("panelSignal").innerHTML = data['wifiSignalPercentual'] + '%';
    }
    if (data.hasOwnProperty("voltage")){
      document.getElementById("panelVoltage").innerHTML = data['voltage'];
    }

    if (data.hasOwnProperty("serial")){
      currentTime = Date.now().toString().substring(8,99);
      responceTime = data['serial'];
      latency = Math.round((currentTime - responceTime));
      document.getElementById("panelLatency").innerHTML = latency;
    }
};
websocket.onclose = function () {
    console.log('WebSocket connection closed');
};

websocket.latencyTestLoop  = function () {
  if (websocket.latencyTestLoopEnabled) {
    currentTime = Date.now().toString().substring(8,99);
    websocket.send(JSON.stringify({"serial": currentTime}))
  }
}
setInterval(websocket.latencyTestLoop, websocket.latencyTestLoopEvery)


//websocket.send("{'servo1':90}");