import styled from "styled-components";

const TinyImg = styled.img`
    width: 14px;
    height: 14px;
`;

const TinyLogo = ({ logo, url }: { logo: string; url: string }) => (
    <TinyImg src={logo} onClick={() => chrome.tabs.create({ url: url })} />
);

export default TinyLogo;
