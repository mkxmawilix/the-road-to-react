import styled from "styled-components";

const StyledContainer = styled.div`
    height: 100vw;
    padding: 20px;

    background: #83a4d4;
    background: -webkit-linear-gradient(to left, #b6fbff, #83a4d4);
    background: linear-gradient(to left, #b6fbff, #83a4d4);

    color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
    font-size: 48px;
    font-weight: 300;
    letter-spacing: 2px;
`;

const StyledButton = styled.button`
    background-color: transparent;
    border: 1px solid #171212;
    padding: 5px;
    cursor: pointer;

    transition: all 0.1s ease-in;

    &:hover {
        background-color: #171212;
        color: #ffffff;
    }

    &:hover > svg > g {
        fill: #ffffff;
        stroke: #ffffff
    }
`;

const StyledButtonSmall = styled(StyledButton)`
    padding: 5px 10px;
`;

const StyledButtonLarge = styled(StyledButton)`
    padding: 10px 15px;
`;

const StyledSearchForm = styled.form`
    padding: 10px 0 20px 0;
    display: flex;
    align-items: baseline;
`;

export { StyledContainer, StyledHeadlinePrimary, StyledButton, StyledButtonSmall, StyledButtonLarge, StyledSearchForm };
