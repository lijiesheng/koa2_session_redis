const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const redisStore = require('koa-redis')
const session = require('koa-generic-session')

const index = require('./routes/index')
const users = require('./routes/users')


app.keys = ['my name is huangshimei']
app.use(session({
  key: 'weibo.sid',   //  cookie key 默认值是 'koa.sid'
  prefix: 'weibo.sess:', // redis key 的前缀，默认是 weibo.sess:
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge : 24 * 60 * 60 * 1000              // cookie 的过期时间，redis的过期时间也是这个
  },
  store: redisStore({
    all : `127.0.0.1:6379`
  })
}))






// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
