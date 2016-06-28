# middle

uses syntax similar to express middlewares, but outside the context of webapps

# Installation

```
npm i -S sturdy-octo-broccoli
```

# Usage Example

```
var middle = require('sturdy-octo-broccoli')

middle(function (context, next) {
  // do something with context

  next(); // call next when you're done.
}, function (context, next) {
  // modifications on context are available in the next function

  if ( context.error ){
     next('got an error'); // pass error. this will reach the next function with error
  } else {
    next(); // simply moves to next function
  }
}, function( context, next ){
    // if the previous function passed an error, we will skip this one
    next();
},function (err, context, next) {
    // this function will be invoked if there was an error, and if there was no error
    // it allows you to handle the error and move on
}, ... )


```

