import React from "react";
import { compareAttributes } from "..";

export const CartContext = React.createContext();

export const CartConsumer = CartContext.Consumer;

export class CartProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cartItems: [], cartTotal: null };
    this.newCartItemHandler = this.newCartItemHandler.bind(this);
    this.deleteCartItemHandler = this.deleteCartItemHandler.bind(this);
    this.purchaseInformation = this.purchaseInformation.bind(this);
    this.emptyCart = this.emptyCart.bind(this);
  }

  componentDidMount() {
    this.setState({ cartItems: [], cartTotal: 0 });
  }

  newCartItemHandler(newItem) {
  //adds newItem to cart when cart is empty
    if (this.state.cartItems.length === 0) {
      //brand new items come with qty = 0
      newItem.qty = newItem.qty === 0 ? newItem.qty = 1 : newItem.qty
      const itemToAdd = {order: this.state.cartItems.length+1, ...newItem}

      this.setState({ cartItems:[itemToAdd], cartTotal:itemToAdd.qty });
      
      return;
    }

    let newCart;
    const sameItemsInCart = this.state.cartItems.filter(
      (item) => item.id === newItem.id
    );

  //adds newItem to cart when the product doesn't exist in cart (keeps the rest of the products in the cart)
    if (sameItemsInCart.length === 0) {
      //brand new items come with qty = 0
      newItem.qty = newItem.qty === 0 ?  1 : newItem.qty

      const itemToAdd = {order: this.state.cartItems.length+1, ...newItem}
      newCart = [...this.state.cartItems, itemToAdd];

    } else {
  //the user is trying to add a product that exists in the cart already
      const restOfItemsInCart = this.state.cartItems.filter(
        (item) => item.id !== newItem.id );
        
//adds the rest of the products to our newCart
      newCart = restOfItemsInCart.length === 0 ? [] : [...restOfItemsInCart];

//attributes needed to be paired with the category (attributeID) and the attribute itself (items.id) since there are attributes with the same id (yes/no options)
      const newAttributes = newItem.selectedAttributes
      .map((attribute) => {
        return { attID: attribute.attributeID, attItem: attribute.items.id, attValue:attribute.items.value };
        })
        .sort((a, b) => a.attId - b.attItem);


      let attributesCheck = []

      sameItemsInCart.forEach((sameItemInCart) => {
        const attributesInCart = sameItemInCart.selectedAttributes
          .map((attribute) => {
            return { attID: attribute.attributeID, attItem: attribute.items.id, attValue:attribute.items.value };
          })
          .sort((a, b) => a.attId - b.attItem);

//compares product's attributes in cart against new product's attributes and stores the result in an array
//since we are in a loop and we only want to add the new product once and not on every single FALSE result 
        const isSameAttributes = compareAttributes(attributesInCart,newAttributes)
        attributesCheck.push(isSameAttributes)

//if it's the same product we only want to update its qty
        if(isSameAttributes){
          //brand new items from Detail or Home come with qty = 0, so we add 1
          sameItemInCart.qty = newItem.qty === 0 ? sameItemInCart.qty + 1 : newItem.qty
        }
        newCart.push(sameItemInCart)

      });

//we add the newProduct only when NONE of our in-cart products had the same attributes
      !attributesCheck.some(check=>check===true) && newCart.push({order:this.state.cartItems.length+1 , ...newItem, qty:newItem.qty===0?1:newItem.qty})

    }

    const newTotal = newCart.reduce((prev, curr) => prev + curr.qty, 0);
    newCart.sort((a,b)=>a.order - b.order)
    this.setState({ cartItems: newCart, cartTotal: newTotal });

  }

  deleteCartItemHandler(order) {

    const newCart = this.state.cartItems.filter(
      (item) => item.order !== order
    );
    const newTotal = newCart.reduce((prev, curr) => prev + curr.qty, 0);

    this.setState({ cartItems: newCart, cartTotal: newTotal });
  }

  purchaseInformation(){
    
    const purchase = this.state.cartItems.map( item => {
      const { brand, name, qty, prices, selectedAttributes} = item

      return {
        brand,
        name,
        qty,
        prices: prices.map(price=> `${price.currency.symbol} ${price.amount * qty}`),
        selectedAttributes
      }

    })
      
    return purchase;
  }

  emptyCart(){
    this.setState({ cartItems: [], cartTotal: 0 });
  }



  render() {
    return (
      <CartContext.Provider
        value={{
          cartItems: this.state.cartItems,
          cartTotal: this.state.cartTotal,
          addNewCartItem: this.newCartItemHandler,
          deleteCartItem: this.deleteCartItemHandler,
          checkout:this.purchaseInformation,
          emptyCart: this.emptyCart
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
