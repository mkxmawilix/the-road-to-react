import React from "react";
import PropTypes from "prop-types";

const CURRENCIES = {
    Euro: {
        code: 'EUR',
        label: 'Euro',
        conversionRate: 1, // base conversion rate
        symbol: '€',
    },
    Usd: {
        code: 'USD',
        label: 'US Dollar',
        conversionRate: 1.19,
        symbol: '$',
    },
};

const CurrencyContext = React.createContext();

const useCurrency = () => {
    const [currency, setCurrency] = React.useContext(CurrencyContext);

    const handleCurrencyChange = (currency) => {
        setCurrency(currency);
    };

    return {
        value: currency,
        onChange: handleCurrencyChange,
    }
};

const CurrencyProvider = ({children}) => {
    const [currency, setCurrency] = React.useState(CURRENCIES.Euro);

    return (
        <CurrencyContext.Provider value={[currency, setCurrency]}>
            {children}
        </CurrencyContext.Provider>
    );
};

CurrencyProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { CurrencyProvider, useCurrency, CURRENCIES };