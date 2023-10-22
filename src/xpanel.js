// The XPanel connection configuration is just a simple JavaScript object:
const configuration = { 
  host: '192.168.1.223',
  ipId: '0x03'
};

// Websocket connection event
window.WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.CONNECT_WS, ({ detail }) => {
  console.log(`WebXPanel websocket connection: ${JSON.stringify(detail)}`);
  if (window.location.pathname === "/ch5-pwa-demo/offline.html") {
    window.location.href = './index.html';
  }
});

// CIP connection event
window.WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.CONNECT_CIP, ({ detail }) => {
  console.log(`WebXPanel CIP connection: ${JSON.stringify(detail)}`);
  if (window.location.pathname === "/ch5-pwa-demo/offline.html") {
    window.location.href = './index.html';
  }
});

// If XPanel authentication fails this will fire
window.WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.AUTHENTICATION_FAILED, ({ detail }) => {
  console.log(`WebXPanel authentication: ${JSON.stringify(detail)}`);
});

// Websocket token request event
window.WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.NOT_AUTHORIZED, ({ detail }) => {
  console.log(`WebXPanel token request: ${JSON.stringify(detail)}`);
  window.location = detail.redirectTo;
});

// Websocket connection failed event
window.WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.ERROR_WS, ({ detail }) => {
  console.log(`WebXPanel connection failed: ${JSON.stringify(detail)}`);
  if (window.location.pathname != '/ch5-pwa-demo/offline.html') {
    window.location.href = './offline.html';
  }
});

// Websocket lost connection event
window.WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.DISCONNECT_WS, ({ detail }) => {
  console.log(`WebXPanel WS connection lost: ${JSON.stringify(detail)}`);
  if (window.location.pathname != '/ch5-pwa-demo/offline.html') {
    window.location.href = './offline.html';
  }
});

// CIP lost connection event
window.WebXPanel.default.addEventListener(WebXPanel.WebXPanelEvents.DISCONNECT_CIP, ({ detail }) => {
  console.log(`WebXPanel CIP connection lost: ${JSON.stringify(detail)}`);
  if (window.location.pathname != '/ch5-pwa-demo/offline.html') {
    window.location.href = './offline.html';
  }
});

// Activate WebXPanel connection if running in a browser
if(window.WebXPanel.isActive) {
  console.log("Initializing WebXPanel");
  console.log(`WebXPanel version: ${window.WebXPanel.getVersion()}`); 
  console.log(`WebXPanel build date: ${window.WebXPanel.getBuildDate()}`);
  window.WebXPanel.default.initialize(configuration);
}