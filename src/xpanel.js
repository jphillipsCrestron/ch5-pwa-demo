// Get WebXPanel objects
const { WebXPanel, isActive, WebXPanelConfigParams, WebXPanelEvents } = window.WebXPanel.getWebXPanel(!window.WebXPanel.runsInContainerApp());

// Activate WebXPanel connection if running in a browser
if(isActive) {
  WebXPanelConfigParams.host = "0.0.0.0";
  WebXPanelConfigParams.ipId = "0x03";

  console.log("Initializing WebXPanel with config: " + JSON.stringify(WebXPanelConfigParams));
  WebXPanel.initialize(WebXPanelConfigParams);
}

let connected = false;

// Websocket connection event
window.addEventListener(WebXPanelEvents.CONNECT_WS, ({ detail }) => {
  console.log(`WebXPanel websocket connection: ${JSON.stringify(detail)}`);
});

// CIP connection event
window.addEventListener(WebXPanelEvents.CONNECT_CIP, ({ detail }) => {
  console.log(`WebXPanel CIP connection: ${JSON.stringify(detail)}`);
  connected = true;
});

// If XPanel authentication fails this will fire
window.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, ({ detail }) => {
  console.log(`WebXPanel authentication: ${JSON.stringify(detail)}`);
});

// Websocket token request event
window.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, ({ detail }) => {
  console.log(`WebXPanel token request: ${JSON.stringify(detail)}`);
  window.location = detail.redirectTo;
});

// Websocket connection failed event
window.addEventListener(WebXPanelEvents.ERROR_WS, ({ detail }) => {
  console.log(`WebXPanel connection failed: ${JSON.stringify(detail)}`);
  connected = false;
});

// Websocket lost connection event
window.addEventListener(WebXPanelEvents.DISCONNECT_WS, ({ detail }) => {
  console.log(`WebXPanel WS connection lost: ${JSON.stringify(detail)}`);
  connected = false;
});

// CIP lost connection event
window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, ({ detail }) => {
  console.log(`WebXPanel CIP connection lost: ${JSON.stringify(detail)}`);
  connected = false;
});

function checkOnlineStatus() {
  console.log('Checking online status...');
  if (window.navigator.onLine && connected) {
    console.log('We are connected');
    if (window.location.pathname === "/ch5-pwa-demo/offline.html") {
      console.log('Redirecting to index');
      window.location.href = './index.html';
    }
  } else {
    console.log('We are not connected');
    if (window.location.pathname === "/ch5-pwa-demo/index.html") {
      console.log('Redirecting to offline');
      window.location.href = './offline.html';
    }
  }
}

setInterval(checkOnlineStatus, 5000);