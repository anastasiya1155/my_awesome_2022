import React from 'react';
import { Chart } from 'react-google-charts';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getTransactionsStatistics } from '../../../utils/routes';
import { CATEGORIES_ARRAY } from '../../../redux/const';

const TransactionsStatistics = props => {
  const [selectedCategories, setSelectedCategories] = React.useState(['Продукты']);
  const [data, setData] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);

  const getChartData = (d, categories) => {
    const cD = [];
    d.forEach(i => {
      const row = [i[0].date];
      categories.forEach(cat => {
        row.push(i.find(mC => mC.category === cat).sum);
      });
      cD.push(row);
    });
    setChartData(cD);
  };

  React.useEffect(() => {
    getTransactionsStatistics().then(resp => {
      const d = Object.values(resp.data);
      setData(d);
      getChartData(d, selectedCategories);
    });
  }, []);

  const handleSelect = e => {
    setSelectedCategories(e.target.value);
    getChartData(data, e.target.value);
  };

  return (
    <div>
      <Select
        style={{ marginBottom: 10 }}
        fullWidth
        multiple
        value={selectedCategories}
        onChange={handleSelect}
      >
        {CATEGORIES_ARRAY.map(cat => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
      <Chart
        height={400}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={[['Date', ...selectedCategories], ...chartData]}
        legendToggle
      />
    </div>
  );
};

export default TransactionsStatistics;
