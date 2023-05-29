import express from 'express'
import getStatus from './status/get.status'
import postUser from './user/post.user'
import { postProduct } from './product/post.add_product'
import loginUser from './user/login.user'

const router = express.Router()
// middleware
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
// home page route
router.get('/', (req, res) => {
    res.send('Example home page')
})
// api route
const apiRoutes = [getStatus, postUser, loginUser]

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
)

//router.get('/api/status', getStatus)

//router.post('/api/user', postUser)
//router.post('/api/product', postProduct)
export default router
