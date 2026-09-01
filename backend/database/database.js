export const PRODUCTS = process.env.PRODUCTS 
  ? JSON.parse(process.env.PRODUCTS) 
  : [];

export const userDB = process.env.USERS 
  ? JSON.parse(process.env.USERS) 
  : {};

export const intentionsDB = new Map();