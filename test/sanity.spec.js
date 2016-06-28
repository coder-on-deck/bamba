var middle = require('..')
var expect = require('expect.js')

describe('middle', function () {
  it('should call functions in order', function (done) {
    middle(
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
    middle(function (context, next) {
      next('this is error')
    }, function (context, next) {
      done(new Error('should skip this middleware'))
    }, function (err, context, next) {
      expect(err).to.be('this is error')
      done()
    })
  })

  it('should invoke middlewares with error appropriately even if no error', function (done) {
    middle(function (context, next) {
      next()
    }, function (context, next) {
      next()
    }, function (err, context, next) {
      expect(err).to.be(null)
      done()
    })
  })
})

