import { useCurrency, CURRENCIES } from "../../context/currency";
import PropTypes from "prop-types";
import { StyledButtonLarge } from "../styled-components";


const CurrencyButtons = () => {
    const { onChange } = useCurrency();
    return Object.values(CURRENCIES).map(currency => (
        <CurrencyButton key={currency.label} onClick={() => onChange(currency)}>
            {currency.label}
        </CurrencyButton>
    ));
};


const CurrencyButton = ({ onClick, children }) => {
    return (
        <StyledButtonLarge type="button" onClick={onClick}>
            {children}
        </StyledButtonLarge>
    )
};

CurrencyButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export { CurrencyButtons };

