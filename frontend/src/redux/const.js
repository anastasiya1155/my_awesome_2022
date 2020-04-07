export const CATEGORIES = {
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
export const IP = 'localhost';
// export const PORT = '8822';
export const PORT = process.env.NODE_ENV === 'production' ? '8888' : '8822';

// export const IP = "192.168.1.5";
