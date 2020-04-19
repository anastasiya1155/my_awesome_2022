import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import WishCreate from './WishCreate';
import WishList from './WishList';
import { deleteWish, getWishes, postWish, putWish } from '../../utils/routes';
import WishEdit from './WishEdit';

const links = ['/wishlist/list', '/wishlist/add'];

const Wishlist = ({ location }) => {
  const [wishes, setWishes] = React.useState([]);
  const [wishToEdit, setWishToEdit] = React.useState(null);
  const fetchWishes = () => {
    getWishes().then(response => {
      if (response.data) {
        const wishesFromResponse = Object.keys(response.data)
          .reverse()
          .map(key => ({ ...response.data[key], id: key }));
        // .filter(w => !w.isDone);
        setWishes(wishesFromResponse);
      }
    });
  };
  React.useEffect(() => {
    fetchWishes();
  }, []);

  const handleAddWish = values => {
    return postWish({
      ...values,
      priceFrom: parseInt(values.priceFrom, 10),
      priceTo: parseInt(values.priceTo, 10),
      userId: process.env.REACT_APP_USER_ID,
      createdAt: new Date(),
      isDone: false,
    })
      .then(() => {
        fetchWishes();
      })
      .catch(console.log);
  };
  const editWish = (id, data) => {
    return putWish(id, data)
      .then(() => {
        fetchWishes();
      })
      .catch(console.log);
  };

  const removeWish = id => {
    deleteWish(id)
      .then(() => {
        fetchWishes();
      })
      .catch(console.log);
  };

  const openEditPopup = w => {
    setWishToEdit(w);
  };

  const handleCloseEdit = () => {
    setWishToEdit(null);
  };

  return (
    <div>
      <Tabs value={links.indexOf(location.pathname)} indicatorColor="primary" textColor="primary">
        <Link to="/wishlist/list" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Tab label="List" />
        </Link>
        <Link to="/wishlist/add" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Tab label="Add" />
        </Link>
      </Tabs>
      <br /> <br />
      <Switch>
        <Route path="/wishlist/add" component={() => WishCreate({ onSubmit: handleAddWish })} />
        <Route
          path="/wishlist/list"
          component={() => WishList({ wishes, editWish, removeWish, openEditPopup })}
        />
      </Switch>
      <WishEdit
        onSubmit={editWish}
        handleClose={handleCloseEdit}
        isOpen={!!wishToEdit}
        wish={wishToEdit}
      />
    </div>
  );
};

export default withRouter(Wishlist);
