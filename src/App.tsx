import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GasWidget from "./components/gasWidget";
import logoOpenNewTap from "./assets/logo_open_in_new_window.svg";
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


const OpenInNewWindowAction = () => {
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        if (setVisible) {
            chrome.windows.getCurrent((window) => {
                setVisible(window.type !== "popup");
            });
        }
    }, [setVisible]);

    return visible ? (
        <BottomRightCorner title={"Open in a tiny popup"}>
            <TinyLogo
                logo={logoOpenNewTap}
                size={16}
                onClick={() =>
                    chrome.windows.create({
                        focused: true,
                        type: "popup",
                        height: 210,
                        width: 185,
                        url: "index.html",
                    })
                }
            />
        </BottomRightCorner>
    ) : (
        <></>
    );
};

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
            <OpenInNewWindowAction />
        </>
    );
};

export default App;
