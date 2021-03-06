import React from "react";

import {ProductPreview} from "../../components";

import { addNavigationTo, getProductsByCategory } from "../../services";

import "./CategoryPage.css";

class CategoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: null, category: null };
  }

  async componentDidMount() {
    const id = this.props.params.id || "all";

    const newProducts = await getProductsByCategory(id);
    if(newProducts ==='error'){
      this.props.navigate('/error')
    }else{
      this.setState({ products: newProducts, category: id });
    }
  }

  async componentDidUpdate() {
    const id = this.props.params.id || "all";
    if (this.state.category !== id) {
      const newProducts = await getProductsByCategory(id);

      this.setState({ products: newProducts, category: id });
    }
  }

  render() {
    return (
      this.state.products && (
        <main className="CategoryPage">
          <h1 className="category-title">{this.state.category}</h1>

          <section className="products-container">
            {this.state.products.map((product) => (
              <ProductPreview key={product.id} product={product} />
            ))}
          </section>
        </main>
      )
    );
  }
}

export default addNavigationTo(CategoryPage);
