const setupIntervalTask = (name, task, timeout) => {
  const updateTimeRecordName = 'INTERVAL_TASK_UPDATE_RECORD';
  if (typeof window[updateTimeRecordName] === 'undefined') {
    window[updateTimeRecordName] = {};
  }

  const slotName = `INTERVAL_TASK_${name}_SLOT`;

  const slot = window[slotName];
  const updatedTime = window[updateTimeRecordName][name];

  if (!slot || !updatedTime || updatedTime < Date.now() - timeout * 2) {
    if (slot) {
      console.debug(`Reset slot, taskName: ${name}`);
      delete window[slotName];
      clearInterval(slot);
    }

    window[slotName] = setInterval(async () => {
      try {
        const result = await task();
        window[updateTimeRecordName][name] = Date.now();
        console.debug(
          `Update task. taskName: ${name}, updateTime: ${window[updateTimeRecordName][name]}, taskResult: `,
          result,
        );
      } catch (e) {
        console.error(`Error in interval task. taskName: ${name}, error: ${e}`);
      }
    }, timeout);
  }
};

const setUpTasks = () => {
  if (!window.BADGER_MONITOR_GASPRICE) {
    setupBadgeUpdatingTask();
    window.BADGER_MONITOR_GASPRICE = true;
  }

  setupIntervalTask(
    'GAS_PRICE',
    () =>
      fetchGasPrice().then((gasPrices) => {
        window.chrome.storage.local.set({ gasPrices });
        return gasPrices;
      }),
    5000,
  );
};

const fetchGasPrice = async () => {
  const response = await fetch(
    'https://blocknative-api.herokuapp.com/data',
  ).then((i) => i.json());
  const data = response.estimatedPrices || [];
  const [rapid, fast, standard] = data.map((i) => i.price);
  return { rapid, fast, standard };
};

const setupBadgeUpdatingTask = () => {
  const listener = (changes, area) => {
    if (area === 'local' && changes.gasPrices?.newValue) {
      const data = changes.gasPrices.newValue;
      renderBadge(parseInt(data.rapid || 0));
    }
  };
  window.chrome.storage.onChanged.addListener(listener);
  window.chrome.storage.local.get('gasPrices', (data) =>
    renderBadge(parseInt(data.gasPrices?.rapid || 0)),
  );
};

const renderBadge = (price) => {
  if (!price || price <= 0) {
    return;
  }

  let color;

  if (price <= 50) {
    color = '#43A047';
  } else if (price <= 200) {
    color = '#F9A825';
  } else {
    color = '#E53935';
  }

  Promise.all([
    window.chrome.browserAction.setBadgeText({
      text: String(price),
    }),
    window.chrome.browserAction.setBadgeBackgroundColor({ color }),
  ]).catch(console.error);
};

window.chrome.alarms.clearAll();
window.chrome.alarms.create('ticker', {
  periodInMinutes: 1,
  when: Date.now(),
});
window.chrome.alarms.onAlarm.addListener(setUpTasks);
setUpTasks();
