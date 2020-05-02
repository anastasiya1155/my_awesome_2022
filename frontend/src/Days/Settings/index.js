import React from 'react';
import PropTypes from 'prop-types';
import LabelsSettings from './LabelsSettings';
import PeriodSettings from './PeriodSettings';

const DaysSettings = props => {
  return (
    <div>
      <LabelsSettings />
      <PeriodSettings />
    </div>
  );
};

DaysSettings.propTypes = {};

export default DaysSettings;
