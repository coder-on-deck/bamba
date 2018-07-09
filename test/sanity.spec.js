var bamba = require('..')
var expect = require('expect.js')

describe('middle', function () {
  it('should call functions in order', function (done) {
    bamba(
      function (context, next) {
        context.name = 'guy'
        next()
      },
      function (context, next) {
        expect(context.name).to.be('guy')
        done()
      })
  })
  it('should propagate errors to appropriate functions', function (done) {
    bamba(function (context, next) {
      next('this is error')
    }, function (context, next) {
      done(new Error('should skip this middleware'))
    }, function (err, context, next) {
      expect(err).to.be('this is error')
      done()
    })
  })

  it('should invoke middlewares with error appropriately even if no error', function (done) {
    bamba(function (context, next) {
      next()
    }, function (context, next) {
      next()
    }, function (err, context, next) {
      expect(err).to.be(null)
      done()
    })
  })

  it('should also support passing context as first parameter', function(done){
    bamba({name: 'foo'}, function(context, next){
      expect(context.name).to.be('foo');
      expect(typeof(done)).to.be('function');
      done();
    });
  })

  it('should also support promises', function(done){
    bamba(function(context, next) {
      return Promise.resolve('some resolution');
    }, function(context, next){
      expect(context._result).to.be('some resolution');
      done();
    })
  })
})
