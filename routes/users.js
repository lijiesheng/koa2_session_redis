const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/login', async (ctx, next)=> {
  const { username, password } = ctx.request.body //获取post请求中的参数
  // 第一次登录
  if (ctx.session.username !== 'aaa' && username === 'aaa' && password === 'bbb') {
    console.log('测试1===>',ctx.session);
    ctx.session.username = 'aaa';
    ctx.session.password = 'bbb';
    ctx.body = '登录成功';
    return
  } else { 
    console.log('测试2===>', ctx.session);
    if (ctx.session) {
      ctx.body = {
        username: ctx.session.username,
        password: ctx.session.password
      }
    }
  } 
})





module.exports = router