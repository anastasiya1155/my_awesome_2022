import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Tab, Tabs as MuiTabs, useMediaQuery } from '@material-ui/core';

const Tabs = ({ value, onChange, tabs }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <MuiTabs
      value={value}
      onChange={onChange}
      indicatorColor="primary"
      textColor="primary"
      variant={isMobile ? 'fullWidth' : 'standard'}
    >
      {tabs.map(t => (
        <Tab label={t.label} onClick={t.onClick} />
      ))}
    </MuiTabs>
  );
};

Tabs.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
};

export default Tabs;
