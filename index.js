function invokeMiddleware (err, middlewares, context, index, callback) {
  var m = middlewares[index]
  if (index < middlewares.length) {
    if (m.length === 3) {
      m(err, context, callback)
    } else { // 2
      m(context, callback)
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
  invokeMiddleware(null, middlewares, context, index, function (err) {
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
  })
}

module.exports = function () {
  var _arguments = arguments
  _arguments = Object.keys(_arguments).map(function (i) {
    return _arguments[i]
  })
  var args = breakdown(_arguments)
  var middlewares = args.middlewares
  var context = args.context
  var index = 0
  invokeMiddlewaresRecursively(middlewares, context, index)
}
