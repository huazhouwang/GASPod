import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logoOpenNewTap from './assets/logo_open_in_new_window.svg';
import { Column, Row } from './widgets/basic/basic';
import TinyLogo from './widgets/basic/tiny-logo';
import BlockNativeGasWidget from './widgets/gas-price';

const WidgetsContainer = styled(Column)`
  padding: 16px;
`;

const BottomRightCorner = styled(Row)`
  position: absolute;
  right: 8px;
  bottom: 8px;
  justify-content: flex-end;
  align-items: flex-end;
`;

const OpenInNewWindowAction = () => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    if (setVisible) {
      chrome.windows.getCurrent((window) => {
        setVisible(window.type !== 'popup');
      });
    }
  }, [setVisible]);

  return visible ? (
    <BottomRightCorner title={'Open in a tiny popup'}>
      <TinyLogo
        logo={logoOpenNewTap}
        size={16}
        onClick={() =>
          chrome.windows.create({
            focused: true,
            type: 'popup',
            height: 210,
            width: 185,
            url: 'index.html',
          })
        }
      />
    </BottomRightCorner>
  ) : (
    <></>
  );
};

const App = () => {
  return (
    <>
      <WidgetsContainer>
        <BlockNativeGasWidget />
      </WidgetsContainer>
      <OpenInNewWindowAction />
    </>
  );
};

export default App;
