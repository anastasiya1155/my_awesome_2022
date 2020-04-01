import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import TransactionsCategoriesShow from './show';
import TransactionsCategoriesCreate from './create';
import { RELOAD_TRANS_CATEGORIES_LIST } from '../../../redux/actions';

class TransactionsCategories extends Component {
  state = {
    categories: [],
    nextId: 0,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.fetchData();
      this.props.reloadList(false);
    }
  }

  fetchData = () => {
    axios
      .get('https://tranf-ae713.firebaseio.com/cat.json')
      .then((response) => {
        const categories = Object.keys(response.data).map((key) => {
          if (response.data[key].id >= this.state.nextId) {
            this.setState({ nextId: response.data[key].id + 1 });
          }
          return {
            id: response.data[key].id,
            name: response.data[key].name,
          };
        });

        this.setState({ categories });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        <TransactionsCategoriesCreate nextId={this.state.nextId} />
        <br />
        <List component="nav">
          {this.state.categories.map((c) => (
            <TransactionsCategoriesShow key={c.id} id={c.id} name={c.name} />
          ))}
        </List>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    reloadTransCategoriesList: state.reloadTransCategoriesList,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    reloadList: (reload) => {
      dispatch({
        type: RELOAD_TRANS_CATEGORIES_LIST,
        payload: {
          reload,
        },
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TransactionsCategories);
