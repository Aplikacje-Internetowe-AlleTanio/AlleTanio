import express from 'express'
import getStatus from './status/get.status'
import loginUser from './user/login.user'
import postAddress from './address/post.address'
import postAddProduct from './product/post.add_product'
import postOrder from './product/post.order'
import patchUserrole from './user/patch.userrole'
import patchUser from './user/patch.user'
import getProducts from './product/get.products'
import postRate from './rate/post.rate' //Ocenianie produktu
import getRating from './rate/get.rating' //Wyświetlanie ocen
import getMessages from './messages/get.messages'
import postRegister from './user/post.register'
import getUsers from './user/get.users'
import postSendComplaint from './complaints/post.send.complaint'
import postSendMessage from './messages/post.send.message'
import getComplaints from './complaints/get.complaints'

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
    postRegister,
    loginUser,
    postAddress,
    postAddProduct,
    patchUserrole,
    postOrder,
    patchUser,
    getProducts,
    postRate,
    getRating,
    postSendMessage,
    getMessages,
    getUsers,
    postSendComplaint,
    getComplaints
]

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
)

export default router
