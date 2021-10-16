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
    'BLOCK_NATIVE_GAS_ESTIMATOR',
    () =>
      fetch('https://blocknative-api.herokuapp.com/data')
        .then((i) => i.json())
        .then((blockNativeGasEstimator) => {
          window.chrome.storage.local.set({ blockNativeGasEstimator });
          return blockNativeGasEstimator;
        }),
    5000,
  );
};

const setupBadgeUpdatingTask = () => {
  const listener = (changes, area) => {
    if (area === 'local' && changes.blockNativeGasEstimator?.newValue) {
      renderBadge(changes.blockNativeGasEstimator.newValue);
    }
  };
  window.chrome.storage.onChanged.addListener(listener);
  window.chrome.storage.local.get('blockNativeGasEstimator', (data) =>
    renderBadge(data.blockNativeGasEstimator),
  );
};

const renderBadge = (blockNativeGasEstimator) => {
  if (!blockNativeGasEstimator) {
    return;
  }

  const price = blockNativeGasEstimator.estimatedPrices[1].price;

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
