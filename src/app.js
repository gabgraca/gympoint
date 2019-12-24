// Inicia/Configura e Retorna o objeto express para o servidor
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Configura o servidor para usar o JSON como padrão
    // das requisições
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    // Configura o servidor para usar as rotas
    // criadas no arquivo routes.js
    this.server.use(routes);
  }
}

// Retorna o objeto server do express
export default new App().server;
