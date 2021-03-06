import React from "react";

import {Carrousel, PriceContainer, Attributes} from "../../components";

import { CartContext, addNavigationTo, validateNewCartItem } from "../../services";
import cartIcn from "../../assets/icons/white-cart.svg";

import "./ProductPreview.css";

class ProductPreview extends React.Component {
  static contextType = CartContext;
  constructor(props) {
    super(props);
    this.state = { active: null, qty: null, selectedAttributes: null, errors:null };
    this.enableProductHandler = this.enableProductHandler.bind(this);
    this.selectAttributeHandler = this.selectAttributeHandler.bind(this);
    this.addToCartHandler = this.addToCartHandler.bind(this);
    this.myProduct = React.createRef();
  }


  componentDidMount() {
    this.setState({ active: false, qty: 0, selectedAttributes: [], errors:false});
  }

  enableProductHandler() {
    if(this.myProduct.current.classList.contains('success-cart')){
      this.myProduct.current.classList.remove('success-cart')
    }
    this.props.product.inStock &&
      this.setState({ ...this.state, active: !this.state.active });
  }

  selectAttributeHandler(newSelectedAttributes){
    if(this.myProduct.current.classList.contains('success-cart')){
      this.myProduct.current.classList.remove('success-cart')
    }
    this.setState({...this.state, selectedAttributes:newSelectedAttributes, errors:false})
  }

  addToCartHandler(){

    this.setState({...this.state,errors:false})
    const newCartItem = validateNewCartItem(this.props.product, this.state.qty, this.state.selectedAttributes)
    
    if(typeof newCartItem === 'string'){
      this.setState({...this.state,errors:newCartItem})
    }else{
      this.context.addNewCartItem(newCartItem)
      this.myProduct.current.classList.add('success-cart')
    }

  }

  render() {
    const { id, inStock, name, brand, prices, gallery, attributes } = this.props.product;
    const { active, qty, selectedAttributes } = this.state;

    return (
        <article
          className={`ProductPreview ${!inStock ? "without-stock" : ""} ${
            active ? "enabled-product" : ""
          }`}
          onMouseEnter={() => this.enableProductHandler()}
          onClick={() => this.props.navigate(`/pdp/${id}`)}
          onMouseLeave={() => this.setState({ ...this.state, active: false, errors:false })}
          ref={this.myProduct}
        >
          <Carrousel
            inStock={inStock}
            images={gallery}
            name={name}
            current={0}
          />

          <section className="preview-content">
            <h2 className="preview-title">
              {" "}
              {brand} - {name}{" "}
            </h2>
            <PriceContainer
              productsPriceInfo={[{prices, qty}]}
            />
          </section>

          {active && (
            <>
              <section
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="add-cart-container"
                  onClick={this.addToCartHandler}
                >
                  <img
                    src={cartIcn}
                    alt="Add to cart button"
                    className="add-cart-icon"
                  />
                </div>
              </section>

              <section className="preview-choices">
                {attributes.map((attribute) => (
                  <Attributes
                    key={attribute.id}
                    attribute={attribute}
                    selectedAttributes={selectedAttributes}
                    selectHandler={this.selectAttributeHandler}
                  />
                ))}
              </section>
              {this.state.errors && <p className="error plp-error">{this.state.errors}</p>}
            </>
          )}
        </article>
      )
  }
}

export default addNavigationTo(ProductPreview);
