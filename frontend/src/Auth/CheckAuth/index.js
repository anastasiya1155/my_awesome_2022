import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, useLocation } from 'react-router-dom';

const CheckAuth = ({ children }) => {
  const [isOk, setIsOk] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsOk(!!token);
  }, [location]);

  return isOk ? children : <Redirect to="/login" />;
};

CheckAuth.propTypes = {
  children: PropTypes.any,
};

export default CheckAuth;
