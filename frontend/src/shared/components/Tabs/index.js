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
      variant={isMobile ? (tabs.length > 3 ? 'scrollable' : 'fullWidth') : 'standard'}
    >
      {tabs.map(t => (
        <Tab
          label={isMobile ? t.mobile.label : t.label}
          icon={isMobile ? t.mobile.icon : t.icon}
          onClick={t.onClick}
        />
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
      icon: PropTypes.node,
      mobile: PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.node,
      }).isRequired,
      onClick: PropTypes.func,
    }),
  ),
};

export default Tabs;
