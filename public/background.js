const appData = {
  gasPrices: {},
  updatedTime: 0,
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

const setUpTask = () => {
  let slot = window.taskSlot;

  if (
    !slot ||
    !appData.updatedTime ||
    appData.updatedTime <= Date.now() - 10000
  ) {
    window.taskSlot = undefined;
    slot && clearInterval(slot);
    fetchGasPrice();
    slot = setInterval(fetchGasPrice, 5000);
    window.taskSlot = slot;
  }
};

const fetchGasPrice = async () => {
  try {
    const response = await fetch(
      'https://blocknative-api.herokuapp.com/data',
    ).then((i) => i.json());
    const data = response.estimatedPrices || [];
    const [rapid, fast, standard] = data.map((i) => i.price);
    const gasPrices = { rapid, fast, standard };
    appData.gasPrices = gasPrices;
    appData.updatedTime = Date.now();

    console.debug('gasPrices: ', gasPrices);
    renderBadge(parseInt(gasPrices.rapid));
    listeners.forEach((listener) => listener(appData));
  } catch (e) {
    console.error(e);
  }
};

const renderBadge = (price) => {
  window.chrome.browserAction.setBadgeText({
    text: String(price),
  });

  let color;

  if (price <= 50) {
    color = '#43A047';
  } else if (price <= 200) {
    color = '#F9A825';
  } else {
    color = '#E53935';
  }

  window.chrome.browserAction.setBadgeBackgroundColor({ color });
};

window.onAppDataChanged = onAppDataChanged;

window.chrome.alarms.clearAll();
window.chrome.alarms.create('ticker', {
  periodInMinutes: 1,
  when: Date.now(),
});
window.chrome.alarms.onAlarm.addListener(setUpTask);
