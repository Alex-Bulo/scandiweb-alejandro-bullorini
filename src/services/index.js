import { getProductsByCategory, getProductById } from "./helpers/apiRequests";
import { addNavigationTo, calculatePrice, compareAttributes } from "./helpers/helpers";
import { validateNewCartItem } from "./helpers/validations";
import { CartContext } from "./context/cartContext";
import { CurrencyContext } from "./context/currencyContext";
import { parseHTML } from "./helpers/parser";


export {
  getProductsByCategory,
  getProductById,
  addNavigationTo,
  calculatePrice,
  compareAttributes,
  validateNewCartItem,
  CartContext,
  CurrencyContext,
  parseHTML
};
