import React, { useEffect, useState } from 'react';
import View from './view';

const BlockNativeGasWidget = () => {
  const [gasPrices, setGasPrices] = useState<any>();

  useEffect(() => {
    if (!setGasPrices) {
      return;
    }

    const updateGasPrices = (blockNativeGasEstimator: any) => {
      if (!blockNativeGasEstimator) {
        return;
      }

      const [rapid, fast, standard] =
        blockNativeGasEstimator.estimatedPrices.map((i: any) => i.price);
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

  let { rapid, fast, standard } = gasPrices || {};
  return (
    <View
      rapid={rapid}
      fast={fast}
      standard={standard}
      onClick={() =>
        chrome.tabs.create({
          url: 'https://www.blocknative.com/gas-estimator',
        })
      }
    />
  );
};

export default BlockNativeGasWidget;
