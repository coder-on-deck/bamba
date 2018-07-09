function invokeMiddleware (err, middlewares, context, index, callback) {
  var m = middlewares[index]
  if (index < middlewares.length) {
    if (m.length === 3) {
      return m(err, context, callback)
    } else { // 2
      return m(context, callback)
    }
  }
}

function breakdown (middlewares) {
  if (middlewares.length > 0 && typeof (middlewares[0]) === 'object') {
    return {context: middlewares[0], middlewares: middlewares.splice(1)}
  } else {
    return {context: {}, middlewares: middlewares}
  }
}

function invokeMiddlewaresRecursively (middlewares, context, index) {

  function handleMiddlewareAnswer(err) {
    index++
    if (!err) {
      setTimeout(function () {
        invokeMiddlewaresRecursively(middlewares, context, index)
      }, 0)
    } else {
      while (index < middlewares.length) {
        if (middlewares[index].length === 3) { // has 'error' in callback
          setTimeout(function () {
            invokeMiddleware(err, middlewares, context, index)
          }, 0)
          break
        }
        index++
      }
    }
  }

  const middlewareResult = invokeMiddleware(null, middlewares, context, index, handleMiddlewareAnswer);
  if (middlewareResult instanceof Promise) {
    middlewareResult.then(result=>{
      context._result = result;
      handleMiddlewareAnswer(null);
    }).catch(err => {
      handleMiddlewareAnswer(err);
    })
  } else if (middlewareResult !== undefined && typeof middlewareResult === 'object'){
    Object.assign(context, middlewareResult);
    handleMiddlewareAnswer();
  }
}

module.exports = function () {
  var _arguments = arguments
  _arguments = Object.values(_arguments);
  var args = breakdown(_arguments)
  var middlewares = args.middlewares
  var context = args.context
  var index = 0
  return invokeMiddlewaresRecursively(middlewares, context, index)
}
