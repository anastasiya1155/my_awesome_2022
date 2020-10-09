export const IP = process.env.NODE_ENV === 'production' ? 'pa2021.solop.cc' : 'localhost';
// export const PORT = '8888';
export const PORT = process.env.NODE_ENV === 'production' ? '8888' : '8822';
export const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https' : 'http';

// export const IP = "192.168.1.5";
