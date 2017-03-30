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

  all() {
    return super.all.apply(this, this.parseArguments(arguments));
  }

  get() {
    return super.get.apply(this, this.parseArguments(arguments));
  }
  
  post() {
    return super.post.apply(this, this.parseArguments(arguments));
  }
  
  put() {
    return super.put.apply(this, this.parseArguments(arguments));
  }
  
  patch() {
    return super.patch.apply(this, this.parseArguments(arguments));
  }
  
  del() {
    return super.del.apply(this, this.parseArguments(arguments));
  }

  parseArguments(params) {
    if (params.length < 2) {
      throw new Error('Invalid arguments');
    }

    if (!_.isString(params[0])) {
      throw new Error('Invalid route path');
    }

    const lastIndex = params.length - 1;
    const action = params[lastIndex];

    if (_.isFunction(action)) {
      return params;
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

    params[lastIndex] = this.controllers[controllerName][actionName];

    return params;
  }

  loadControllers() {
    const loadedControllers = requireDir(this.controllersPath);

    for (let key in loadedControllers) {
      this.controllers[key] = new loadedControllers[key]();
    }
  }
}

module.exports = Router;