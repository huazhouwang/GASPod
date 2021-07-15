const appData = {
    gasNowData: {},
};

const listeners = [];
const onAppDataChanged = (listener) => {
    if (listeners.includes(listener)) {
        return;
    }

    listener(appData);
    listeners.push(listener);

    return () =>
        listeners.indexOf(listener) >= 0 &&
        listeners.splice(listeners.indexOf(listener), 1);
};

const launchWebSocket = () => {
    console.debug("ticker");

    let ws = window.websocketIns;
    if (ws && ws.readyState !== WebSocket.CLOSED) {
        return;
    }

    try {
        console.debug("Binding websocket");
        ws = new WebSocket("wss://www.gasnow.org/ws");
        ws.onopen = () => console.debug("Connection open ...");
        ws.onclose = () => console.debug("Connect closed.");
        ws.onmessage = onWsMessage;
        window.websocketIns = ws;
    } catch (e) {
        console.error(e)
    }
};

const normalize = (price) => String((price / 1e9).toFixed(0));

const onWsMessage = (event) => {
    const resp = JSON.parse(event.data);

    if (resp.type && resp.data) {
        const gasPrices = resp.data.gasPrices;
        Object.keys(gasPrices).forEach((key) => {
            gasPrices[key] = normalize(gasPrices[key]);
        });

        const gasNowData = {
            ...resp.data,
            gasPrices,
            timestamp: resp.data.timestamp,
        };
        console.debug(gasNowData);
        appData.gasNowData = gasNowData;

        renderBadge(parseInt(gasPrices.fast));
        listeners.forEach((listener) => listener(appData));
    }
};

const renderBadge = (price) => {
    window.chrome.browserAction.setBadgeText({
        text: String(price),
    });

    let color;

    if (price <= 50) {
        color = "#43A047";
    } else if (price <= 200) {
        color = "#F9A825";
    } else {
        color = "#E53935";
    }

    window.chrome.browserAction.setBadgeBackgroundColor({ color });
};

window.launchWebSocket = launchWebSocket;
window.onAppDataChanged = onAppDataChanged;

window.chrome.alarms.clearAll();
window.chrome.alarms.create("ticker", {
    periodInMinutes: 1,
    when: Date.now(),
});
window.chrome.alarms.onAlarm.addListener(launchWebSocket);
