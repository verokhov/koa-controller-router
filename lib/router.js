const _ = require('lodash');
const appRoot = require('app-root-path');
const KoaRouter = require('koa-router');
const path = require('path');
const requireDir = require('require-dir');

class Router extends KoaRouter {
  constructor(props = {}) {
    super(props);

    this.controllers = {};
    this.controllersPath = props.controllersPath || path.resolve(appRoot.path, 'controllers');
  
    this.loadControllers();
  }

  all(path, middleware) {
    return super.all(path, this.getAction(middleware));
  }

  get(path, middleware) {
    return super.get(path, this.getAction(middleware));
  }
  
  post(path, middleware) {
    return super.post(path, this.getAction(middleware));
  }
  
  put(path, middleware) {
    return super.put(path, this.getAction(middleware));
  }
  
  patch(path, middleware) {
    return super.patch(path, this.getAction(middleware));
  }
  
  del(path, middleware) {
    return super.del(path, this.getAction(middleware));
  }

  getAction(action) {
    if (_.isFunction(action)) {
      return action;
    } else if (!_.isString(action)) {
      throw new Error('Invalid controller type');
    }

    const paths = action.split('@');

    if (paths.length !== 2) {
      throw new Error('Invalid controller');
    }

    const controllerName = paths[0];
    const actionName = paths[1];

    if (!this.controllers[controllerName]) {
      throw new Error('Undefined controller');
    }

    if (!this.controllers[controllerName][actionName]) {
      throw new Error('Undefined action in controller');
    }

    return this.controllers[controllerName][actionName];
  }

  loadControllers() {
    const loadedControllers = requireDir(this.controllersPath);

    for (let key in loadedControllers) {
      this.controllers[key] = new loadedControllers[key]();
    }
  }
}

module.exports = Router;