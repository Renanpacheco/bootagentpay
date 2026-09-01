export const CATALOGO = process.env.CATALOGO 
  ? JSON.parse(process.env.CATALOGO) 
  : [];

export const usuariosDB = process.env.USUARIOS 
  ? JSON.parse(process.env.USUARIOS) 
  : {};

export const intencoesDB = new Map();