import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '@material-ui/core/List';
import TransactionsCategoriesShow from './show';
import TransactionsCategoriesCreate from './create';
import { getTransCategoriesAction } from '../../shared/api/handlers';

const TransactionsCategories = props => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.transactions.categories);

  React.useEffect(() => {
    getTransCategoriesAction(dispatch);
  }, []);

  return (
    <div>
      <TransactionsCategoriesCreate />
      <br />
      <List component="nav">
        {categories.map(c => (
          <TransactionsCategoriesShow key={c.id} id={c.id} name={c.name} />
        ))}
      </List>
    </div>
  );
};

export default TransactionsCategories;
