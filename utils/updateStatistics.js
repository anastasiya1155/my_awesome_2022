const data = require('./data.json');
const axios = require('axios');
const categories = require('./categories.json');

const countSum = transactions => {
  let total = 0;
  transactions.forEach(tr => (total += tr.amount));
  return total;
};

const aggregate = () => {
  const graph = [];
  Object.keys(data).forEach(year => {
    data[year].forEach((month, monthIndex) => {
      if (month) {
        const byCategory = Object.values(categories).map(cat => {
          const filtered = Object.keys(month)
            .map(key => ({...month[key], id: key}))
            .filter(tr => tr.category === cat.id);
          console.log(cat.name, filtered);
          const sum = countSum(filtered);
          return {sum, category: cat.name, date: `${monthIndex + 1}-${year}`};
        });
        graph.push(byCategory);
      }
    });
  });
  console.log(graph);
  for (let i = 0; i < graph.length; i++) {
    setTimeout(
      () => axios.post('https://tranf-ae713.firebaseio.com/transactions-statistics.json', graph[i]),
      i * 200,
    );
  }
};

axios.delete('https://tranf-ae713.firebaseio.com/transactions-statistics.json');
aggregate();
