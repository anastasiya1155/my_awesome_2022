import React from 'react';
import { Chart } from 'react-google-charts';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getTransactionsStatistics } from '../../shared/api/routes';
import { useSelector } from 'react-redux';

const TransactionsStatistics = () => {
  const [selectedCategories, setSelectedCategories] = React.useState(['Продукты']);
  const [data, setData] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);
  const categories = useSelector((state) => state.transactions.categories);

  const getChartData = (d, cats) => {
    const cD = [];
    const grouped = {};
    d.forEach((i) => {
      if (grouped[i.Date]) {
        grouped[i.Date].push(i);
      } else {
        grouped[i.Date] = [i];
      }
    });
    Object.entries(grouped).forEach(([month, trans]) => {
      const row = [month];
      cats.forEach((cat) => {
        const category = categories.find(({ name }) => name === cat);
        row.push(trans.find((mC) => mC.Category === category.id.toString())?.Sum || 0);
      });
      cD.push(row);
    });
    setChartData(cD);
  };

  React.useEffect(() => {
    getTransactionsStatistics().then((resp) => {
      const d = Object.values(resp.data);
      setData(d);
      getChartData(d, ['Продукты']);
    });
  }, []);

  const handleSelect = (e) => {
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
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.name}>
            {cat.name}
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
