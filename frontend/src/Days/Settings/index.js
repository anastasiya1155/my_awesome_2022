import React from 'react';
import LabelsSettings from './LabelsSettings';
import PeriodSettings from './PeriodSettings';
import PhotosSettings from './PhotosSettings';

const DaysSettings = () => {
  return (
    <div>
      <PhotosSettings />
      <LabelsSettings />
      <PeriodSettings />
    </div>
  );
};

export default DaysSettings;
