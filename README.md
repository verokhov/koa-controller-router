# koa-controller-router

> Router middleware extended from [koa-router](https://github.com/alexmingoia/koa-router) for [koa 1.x](https://github.com/koajs/koa/tree/v1.x)

## Installation

Install using [npm](https://www.npmjs.com/):

```sh
npm install koa-controller-router
```

## Usage example

**Create controller**
```js
// app/controllers/ArticleController.js

class ArticleController {
    *list() {
        // some code
    }
    
    *show() {
        // some code
    }
    
    *create() {
        // some code
    }

    *update() {
        // some code
    }

    *destroy() {
        // some code
    }
}

module.exports = ArticleController;
```


**Create routes**
```js
// index.js
const path = require('path');
const Koa = require('koa');
const Router = require('koa-controller-router');

const app = new Koa();
const router = new Router({
  controllersPath: path.resolve(__dirname, 'app', 'controllers') // default value is /path/to/project/controllers/
});

const authMiddleware = function *(next) {
    // auth check
    
    yield next;
};

const isAdminMiddleware = function *(next) {
    // check user role
    
    yield next;
};

router.get('/', function *() {
    // some code
});

router.get('/api/v1/articles', 'ArticleController@list');
router.get('/api/v1/articles/:id', 'ArticleController@show');
router.post('/api/v1/articles', authMiddleware, 'ArticleController@create');
router.put('/api/v1/articles/:id', authMiddleware, 'ArticleController@update');
router.patch('/api/v1/articles/:id', authMiddleware, 'ArticleController@update');
router.del('/api/v1/articles', authMiddleware, isAdminMiddleware, 'ArticleController@destroy');

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
```

# Licence
MIT
