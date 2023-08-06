import { useCurrency, CURRENCIES } from "../context/currency";
import PropTypes from "prop-types";


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
        <button type="button" onClick={onClick}>
            {children}
        </button>
    )
};

CurrencyButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default CurrencyButtons;

