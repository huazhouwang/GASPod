import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GasWidget from "./components/gasWidget";
import logoGithub from "./assets/logo_github.svg";
import { Column, Row } from "./components/basic";
import TinyLogo from "./components/tinyLogo";

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

const App = () => {
    const [gasNowData, setGasNowData] = useState<any>();

    useEffect(() => {
        if (!setGasNowData) {
            return;
        }

        let onClose: any | null = null;
        chrome.runtime.getBackgroundPage((backgroundPage: any) => {
            try {
                backgroundPage.launchWebSocket &&
                    backgroundPage.launchWebSocket();
            } catch (e) {
                console.log(e);
            }

            onClose = backgroundPage.onAppDataChanged(
                (appData: any) => appData && setGasNowData(appData.gasNowData)
            );
        });

        return () => onClose && onClose();
    }, [setGasNowData]);

    let {
        gasPrices: { rapid, fast, standard },
    } = gasNowData || { gasPrices: {} };

    return (
        <>
            <WidgetsContainer>
                <GasWidget rapid={rapid} fast={fast} standard={standard} />
            </WidgetsContainer>
            <BottomRightCorner>
                <TinyLogo logo={logoGithub} url={"https://github.com/huazhouwang/GASPod"} />
            </BottomRightCorner>
        </>
    );
};

export default App;
