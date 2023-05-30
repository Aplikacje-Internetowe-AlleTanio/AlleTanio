import express from 'express'
import getStatus from './status/get.status'
import postUser from './user/post.user'
import loginUser from './user/login.user'
import postAddress from './address/post.address'
import postAddProduct from './product/post.add_product'
import patchUserrole from './user/patch.userrole'

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
const apiRoutes = [
    getStatus,
    postUser,
    loginUser,
    postAddress,
    postAddProduct,
    patchUserrole,
]

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
)

export default router
