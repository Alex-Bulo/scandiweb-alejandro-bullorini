import React from "react";

const CartContext = React.createContext();

export const CartConsumer = CartContext.Consumer;

export class CartProvider extends React.Component {


  constructor(props) {
    super(props);
    this.state = { cartItems: null, cartTotal: null };
    this.newCartItemHandler = this.newCartItemHandler.bind(this)
    this.deleteCartItemHandler = this.deleteCartItemHandler.bind(this)
    this.pricesByCurrencyHandler = this.pricesByCurrencyHandler.bind(this)
  }

  componentDidMount() {
    this.setState({ cartItems: [], cartTotal: 0 });
  }



  
  newCartItemHandler(cartItem) {
    this.setState({...this.state, cartItems: this.state.cartItems.push(cartItem)});
  }
  deleteCartItemHandler(cartItemId) {
    this.setState({...this.state, cartItems: this.state.cartItems.filter(item=> item.id !== cartItemId)});
  }
  pricesByCurrencyHandler(currency){
    if(this.state.cartItems.length > 0){
        const newCartItems = this.state.cartItems.map(item => {
            
            const newPrice = item.prices.filter(price => price.currency.label === currency)[0]
    
            return{
                ...item,
                price:{
                    amount: newPrice.amount * item.qty,
                    currency: newPrice.currency
                }

            }
        })

        this.setState({...this.state, cartItems:newCartItems})

    }
  }

  render() {
    return (
      <CartContext.Provider
        value={{
          cartItems: this.state.cartItems,
          cartTotal: this.state.cartTotal,
          addNewCartItem: this.newCartItemHandler,
          deleteCartItem: this.deleteCartItemHandler,
          updatePricesByCurrency : this.pricesByCurrencyHandler
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export default CartContext;