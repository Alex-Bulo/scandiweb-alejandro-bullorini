import React from "react";
import ReactDOM from "react-dom";
import "./assets/globalStyles/globalStyles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { CurrencyProvider } from "./services/context/currencyContext";
import { CartProvider } from "./services/context/cartContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
