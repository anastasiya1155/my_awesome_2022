import React, { Component } from 'react';
import {getTransactionsCategories} from "../../../utils/routes";

class TransactionsCategoriesDelete extends Component {
  state = {
    categories: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
      getTransactionsCategories()
          .then((response) => {
        const categories = Object.keys(response.data).map((key) => ({
          id: response.data[key].id,
          name: response.data[key].name,
        }));

        this.setState({ categories });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        <br />
        <br />
        <br />
        {this.state.categories.map((c) => (
          <div key={c.id}>
            {c.id} - {c.name}
          </div>
        ))}
      </div>
    );
  }
}
export default TransactionsCategoriesDelete;
