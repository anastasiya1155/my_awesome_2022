import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { deleteWish, getWishes, postWish, putWish } from '../shared/api/routes';
import Tabs from '../shared/components/Tabs';
const WishCreate = lazy(() => import(/* webpackChunkName: "wish-add" */ './WishCreate'));
const WishList = lazy(() => import(/* webpackChunkName: "wish-list" */ './WishList'));
const WishEdit = lazy(() => import(/* webpackChunkName: "wish-edit" */ './WishEdit'));

const links = ['/wishlist/list', '/wishlist/add'];

const Wishlist = ({ history, location }) => {
  const [activeTab, setActiveTab] = React.useState(links.indexOf(location.pathname));
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
      <Tabs
        value={activeTab}
        onChange={(e, newVal) => setActiveTab(newVal)}
        tabs={[
          {
            label: 'List',
            mobile: { label: 'List' },
            onClick: () => history.push('/wishlist/list'),
          },
          { label: 'Add', mobile: { label: 'Add' }, onClick: () => history.push('/wishlist/add') },
        ]}
      />
      <br /> <br />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/wishlist/add">
            <WishCreate onSubmit={handleAddWish} />
          </Route>
          <Route path="/wishlist/list">
            <WishList
              wishes={wishes}
              editWish={editWish}
              removeWish={removeWish}
              openEditPopup={openEditPopup}
            />
          </Route>
        </Switch>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        {wishToEdit ? (
          <WishEdit
            onSubmit={editWish}
            handleClose={handleCloseEdit}
            isOpen={!!wishToEdit}
            wish={wishToEdit}
          />
        ) : null}
      </Suspense>
    </div>
  );
};

export default Wishlist;
