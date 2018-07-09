const util = require('util');

function breakdown (middlewares) {
  let result = null;
  if (middlewares.length > 0 && typeof (middlewares[0]) === 'object') {
    result = {context: middlewares[0], middlewares: middlewares.splice(1)}
  } else {
    result = {context: {}, middlewares: middlewares}
  }

  result.middlewares = (result.middlewares || []).map( m => util.promisify(m));
  return result;
}


module.exports = function () {
  let _arguments = arguments
  _arguments = Object.values(_arguments);
  const {middlewares, context} = breakdown(_arguments)

  let result = Promise.resolve();
  middlewares.forEach(m=>{
    result.then(()=>m(context).then(data=>{
      if (typeof(data) === 'object'){
        Object.assign(context, data);
      }
    }));
  })
  return result;

}
