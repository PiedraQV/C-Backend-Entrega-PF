import config from '../server';

export default class PersistenceFactory {
  static getPersistence = async () => {
    switch (config.app.persistence) {
      case '_id':
        let { default: CarritoService } = await import('./dao/cartDbDao');
        return new CarritoService();
      case '_id':
        let { default: ProductoService } = await import('./dao/productDbDao');
        return new ProductoService();
      case '_id':
        let { default: UsuarioService } = await import('./dao/userDbDao');
        return new UsuarioService();
    }
  };
}