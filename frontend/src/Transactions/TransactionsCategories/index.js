import React from 'react';
import { useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import TransactionsCategoriesShow from './show';
import TransactionsCategoriesCreate from './create';

const TransactionsCategories = () => {
  const categories = useSelector((state) => state.transactions.categories);

  return (
    <div>
      <TransactionsCategoriesCreate />
      <br />
      <List component="nav">
        {categories.map((c) => (
          <TransactionsCategoriesShow key={c.id} id={c.id} name={c.name} />
        ))}
      </List>
    </div>
  );
};

export default TransactionsCategories;
