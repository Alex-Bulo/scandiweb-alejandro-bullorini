import React from "react";

import { client, Query } from "@tilework/opus";


export const CurrencyContext = React.createContext();

export const CurrencyConsumer = CurrencyContext.Consumer;

export class CurrencyProvider extends React.Component {
  
  
  constructor(props) {
    super(props);
    this.state = { currencies: null, selectedCurrency: null };
    this.newCurrencyHandler = this.newCurrencyHandler.bind(this)
  }

  async componentDidMount() {
    client.setEndpoint("http://localhost:4000");

    const getCurrencies = new Query("currencies", true).addFieldList([
      "label",
      "symbol",
    ]);

    const { currencies } = await client.post(getCurrencies);

    this.setState({ currencies: currencies, selectedCurrency: currencies[0] });
  }

  newCurrencyHandler(currency) {
    this.setState({ ...this.state, selectedCurrency: currency });
    // this.context.updatePricesByCurrency(currency.label)
  }

  render() {
    return (
      <CurrencyContext.Provider
        value={{
          currencies: this.state.currencies,
          selectedCurrency: this.state.selectedCurrency,
          selectNewCurrency: this.newCurrencyHandler,
        }}
      >
        {this.props.children}
      </CurrencyContext.Provider>
    );
  }
}
