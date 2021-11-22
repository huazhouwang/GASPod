import React, { useCallback, useEffect, useState } from 'react';
import View from './view';

const parsePrice = (eip1559Enabled: boolean, price: any): string => {
  if (!price) {
    return '--';
  } else if (eip1559Enabled) {
    return `${price.maxPriorityFeePerGas}/${price.maxFeePerGas}`;
  } else {
    return `${price.price} GWEI`;
  }
};

const BlockNativeGasWidget = () => {
  const [gasPrices, setGasPrices] = useState<any>();
  const [eip1559Enabled, setEIP1559Enabled] = useState<boolean>(false);
  const switchEIP1559Enabled = useCallback(() => {
    const newValue = !eip1559Enabled;
    chrome.storage.sync.set({ eip1559Enabled: newValue }, () =>
      setEIP1559Enabled(() => newValue),
    );
  }, [eip1559Enabled, setEIP1559Enabled]);

  useEffect(() => {
    if (!setEIP1559Enabled) {
      return;
    }

    chrome.storage.sync.get('eip1559Enabled', (data) =>
      setEIP1559Enabled(data?.eip1559Enabled === true),
    );
    const listener = (changes: any, area: any) => {
      if (typeof changes.eip1559Enabled?.newValue !== 'undefined') {
        setEIP1559Enabled(changes.eip1559Enabled.newValue === true);
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return () => listener && chrome.storage.onChanged.removeListener(listener);
  }, [setEIP1559Enabled]);

  useEffect(() => {
    if (!setGasPrices) {
      return;
    }

    const updateGasPrices = (blockNativeGasEstimator: any) => {
      if (!blockNativeGasEstimator) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [rapid, _, fast, __, standard] =
        blockNativeGasEstimator.estimatedPrices;
      setGasPrices({ rapid, fast, standard });
    };

    chrome.storage.local.get('blockNativeGasEstimator', (data) =>
      updateGasPrices(data.blockNativeGasEstimator),
    );

    const listener = (changes: any, area: any) => {
      if (area === 'local' && changes.blockNativeGasEstimator?.newValue) {
        updateGasPrices(changes.blockNativeGasEstimator.newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return () => listener && chrome.storage.onChanged.removeListener(listener);
  }, [setGasPrices]);

  const { rapid, fast, standard } = gasPrices || {};
  return (
    <View
      eip1559Enabled={eip1559Enabled}
      switchEIP1559Enabled={switchEIP1559Enabled}
      rapid={parsePrice(eip1559Enabled, rapid)}
      fast={parsePrice(eip1559Enabled, fast)}
      standard={parsePrice(eip1559Enabled, standard)}
      onClick={() =>
        chrome.tabs.create({
          url: 'https://www.blocknative.com/gas-estimator',
        })
      }
    />
  );
};

export default BlockNativeGasWidget;
