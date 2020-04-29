const data = require('../frontend/data.json');
const axios = require('axios');

const CATEGORIES = {
  2: { id: 2, name: 'Теннис' },
  6: { id: 6, name: 'Абонимент' },
  11: { id: 11, name: 'Общ. транспорт' },
  12: { id: 12, name: 'Такси' },
  14: { id: 14, name: 'Обед' },
  16: { id: 16, name: 'Подарки' },
  20: { id: 20, name: 'Отдых и развлечения' },
  22: { id: 22, name: 'Кабаки' },
  27: { id: 27, name: 'Гигиена' },
  29: { id: 29, name: 'Разовые траты' },
  31: { id: 31, name: 'Продукты' },
  33: { id: 33, name: 'Интернет' },
  34: { id: 34, name: 'Хозтовары' },
  35: { id: 35, name: 'Сотовая связь' },
  36: { id: 36, name: 'Медицина' },
  37: { id: 37, name: 'Одежда' },
  48: { id: 48, name: 'Аренда' },
  50: { id: 50, name: 'Дорога Житомир' },
  51: { id: 51, name: 'Путешествия' },
  52: { id: 52, name: 'Кафе' },
  53: { id: 53, name: 'Утримання квартир' },
  54: { id: 54, name: 'Ремонт' },
  55: { id: 55, name: 'Техника' },
};

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
        const categories = Object.keys(CATEGORIES).map(id => {
          const filtered = Object.keys(month)
            .map(key => ({...month[key], id: key}))
            .filter(tr => tr.category.toString() === id);
          const sum = countSum(filtered);
          return {sum, category: CATEGORIES[id].name, date: `${monthIndex + 1}-${year}`};
        });
        graph.push(categories);
      }
    });
  });
  for (let i = 0; i < graph.length; i++) {
    setTimeout(
      () => axios.post('https://tranf-ae713.firebaseio.com/transactions-statistics.json', graph[i]),
      i * 200,
    );
  }
};

axios.delete('https://tranf-ae713.firebaseio.com/transactions-statistics.json');
aggregate();
