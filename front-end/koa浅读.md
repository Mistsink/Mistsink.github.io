---
title: koa浅读
preview: 直奔主题，直接 git clone，创建测试样例来慢慢调试。
createTime: 2022/10/31
---

## Koa2

> 直奔主题，直接 git clone，创建测试样例来慢慢调试。

![image-20201118233716030](https://i.loli.net/2020/11/18/XbogUmaJNWVz9Fd.png)

单步调试后，首先进入koaApplication的构造函数中：

```js
// test.js
const app = new Koa()

// application.js
// 该Application类继承自Emitter类，使得koa实例具有处理异步 I/O 操作的能力
// 小提一句：events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。
class Application extends Emitter {
 		constructor(options) {
      super();

      // 下面大部分是配置
      options = options || {};
      this.proxy = options.proxy || false;
      this.subdomainOffset = options.subdomainOffset || 2;
      this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
      this.maxIpsCount = options.maxIpsCount || 0;
      this.env = options.env || process.env.NODE_ENV || 'development';
      if (options.keys) this.keys = options.keys;
      
      // 这里开始
      // 创建中间件数组
      this.middleware = [];

      // 创建全局依赖的上下文，koa应用的主要操作都是在上下文中进行的
      this.context = Object.create(context);

      // 构建请求于响应
      this.request = Object.create(request);
      this.response = Object.create(response);
      // util.inspect.custom support for node 6+
      /* istanbul ignore else */
      if (util.inspect.custom) {
        this[util.inspect.custom] = this.inspect;
      }
    } 
}
```

> 这里创建ctx、req、res时，用的是Object.create()而不是直接赋值，我的理解是可能是为了做到继承的效果，如果仅仅是简单的赋值：this.context = context;这样的话就只是传递了context对象的地址，无法实现继承这种特性。

```js
// test.js
app.use(fn1)
app.use(fn2)
app.use(fn3)

// application.js
  use(fn) {
    // 其他的代码我已删去
    // 将实例中使用的中间件函数注册到数组中去
    this.middleware.push(fn);
    return this;
  }
```

```js
// test.js
app.listen(3000)

// application.js
  listen(...args) {
    const server = http.createServer(this.callback()); // 这里调用了callback方法
    return server.listen(...args);
  }

  callback() {
    // 这里给了一个fn---->重点！！！
    // 使用compose函数进行洋葱模型的构建，当我们再次调用的时候就会是剥洋葱式地依照顺序，自前向后，又自后向前
    const fn = compose(this.middleware);
    // 构造一个对请求的处理的函数
    const handleRequest = (req, res) => {
      // 构造上下文，将这个上下文传入请求处理方法中，使中间件函数能对全局ctx进行更改等操作
      const ctx = this.createContext(req, res);
      // 调用请求处理方法
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
```

```js
// application.js
  listen(...args) {
    debug('listen');
		const server = http.createServer(this.callback());
    // 最后执行node原生的http的server.listen方法创建服务器
    return server.listen(...args);
  }
```

好嘞，基本的流程就是这样，一个简单的应用程序就创建完成了。



> 接下来就主要看下这个callback函数

## 洋葱模型🧅

![image-20201118233716030](https://user-gold-cdn.xitu.io/2020/3/12/170ce29e8797e2ce?imageslim)

我们先从这个洋葱模型来入手：

```js
function compose(middleware) {
/**
*  上面是一堆判断函数：判断是否是数组、里面是否是函数
*/
  return function (context, next) {
      // last called middleware #
      let index = -1
      return dispatch(0)
      function dispatch (i) {
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))
        index = i
        let fn = middleware[i]
        
        // 当所有中间件函数调用完成后，只需要返回一个空的函数就行，这里就是返回了Promise.resolve()
        if (i === middleware.length) fn = next
        if (!fn) return Promise.resolve()
        try {
          
          // 这里进行递归调用，每次dispatch绑定的函数成了use参数列表中的next函数
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
}
// koa 实例中的调用
const fn = compose(middleware); // middleware: usedFunc[]

//returned--->就相当于下面这个样子
equivalentFunc = () => {
  Promise.resolve(fn1(ctx,
    () => Promise.resolve(fn2(ctx,
        () => Promise.resolve(fn3(ctx,
            () => Promise.resolve()))))))
}
// 也就是说，当app程序真正注册之后，各中间件函数被整合成了一层层嵌套的Promise,当被调用的时候就成了剥洋葱的样子，从外至里，又从里至外（还是大佬会玩
```



## 处理请求🙏

> 这部分主要就看这个callback后面的地方

```js
  callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);

    // 就在这里了
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```

返回了一个函数用来做请求的处理函数：`handleRequest`

先就是创建一个`ctx`保证下面处理函数中对`ctx`是影响整个请求实例的

```js
  createContext(req, res) {
    // 注意他给的ctx是继承在全局的ctx下的，包括req、res，都是继承在全局的req、res下的。
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    
    // 并且将实例对象（app）及req、res都赋在了各对象中
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
```

给个思维导图就是这样：

![image-20201122001832770](https://i.loli.net/2020/11/22/xhlGHUS3b1nENea.png)

主要来看里面的`this.handleRequest`

```js
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    // 管理请求状态
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    // 处理响应的函数
    const handleResponse = () => respond(ctx);
    // 响应结束时执行的函数（错误处理
    onFinished(res, onerror);
    
    // 先执行中间件函数，再执行响应处理函数
    return fnMiddleware(ctx).then(handleResponse).catch(onerror); // 并且带上了错误处理
  }
```



## 错误处理

> koa中对于错误处理，我们只需要这样使用就可以了：
>
> app.on('error', err => {
>
> ​		/* handleError */
>
> })
>
> 那么koa是如何做的呢？

核心的地方就是上面刚提到的`handleRequest`处理：

```js
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    
    // 处理错误的函数
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    
    // 响应结束时执行的函数（错误处理
    onFinished(res, onerror);
    
    // 先执行中间件函数，这里在执行中间件函数过程中，一旦有错误，它都能捕获到
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

// 回顾下中间件函数的处理
function compose(middleware) {
  return function (context, next) {
        // 这个地方，一旦有错误，便会reject出去
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
}
```

但是有一个地方值得注意，

```js
 const onerror = err => ctx.onerror(err);
```

这里的`onerror`函数是用的`ctx`的，为什么可以在`app`上监听到呢？

可以去康康`context`👀

```js
// 主要就是在这里

onerror(err) {
    // delegate
    this.app.emit('error', err, this);
}

// 它进行了一个代理，向app上发送事件，进而用app上的onerror函数来处理错误，也是因为Application类继承自Emitter才能做到的。
```



## ok👌白白～