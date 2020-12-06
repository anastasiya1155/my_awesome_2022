const fs = require('fs');
const moment = require('moment');
const data = require('../transactions.json');

const migrate = () => {
  const trans = [];
  Object.values(data)
    .forEach(year => year.forEach(mon => {
      if (mon) {
        Object.values(mon).forEach(tr => {
          if (tr) {
            trans.push({...tr, date: moment(tr.date).format('YYYY-MM-DD HH:mm:ss')})
          }
        })
      }
    }))
  console.log(trans.length);
  fs.writeFileSync('tr.json', JSON.stringify(trans))
};

migrate();
