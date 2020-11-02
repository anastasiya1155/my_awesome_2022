import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Tab, Tabs as MuiTabs, useMediaQuery } from '@material-ui/core';

const Tabs = ({ value, onChange, tabs, history }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const tabsToUse = isMobile ? tabs.filter(({ hideOnMobile }) => !hideOnMobile) : tabs;
  const index = tabsToUse.findIndex(({ path }) => path === value);
  return (
    <MuiTabs
      value={index}
      onChange={(e, newVal) => onChange(tabsToUse[newVal].path)}
      indicatorColor="primary"
      textColor="primary"
      variant={isMobile ? (tabs.length > 3 ? 'scrollable' : 'fullWidth') : 'standard'}
    >
      {tabs.map((t, i) =>
        t.hideOnMobile && isMobile ? null : (
          <Tab
            key={t.label || i}
            label={isMobile ? t.mobile.label : t.label}
            icon={isMobile ? t.mobile.icon : t.icon}
            onClick={() => history.push(t.path)}
          />
        ),
      )}
    </MuiTabs>
  );
};

Tabs.propTypes = {
  value: PropTypes.string,
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
      hideOnMobile: PropTypes.bool,
    }),
  ),
  history: PropTypes.object.isRequired,
};

export default Tabs;
