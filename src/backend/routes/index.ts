import express from 'express'
import getStatus from './status/get.status'

import postUser from './user/post.user' //Rejestracja
import loginUser from './user/login.user' //Logowanie

import postAddress from './address/post.address' //Dodawanie adresów

import postAddProduct from './product/post.add_product' //Dodawanie produktu
import postOrder from './product/post.order' //Składanie zamówień

import postRate from './rate/post.rate' //Ocenianie produktu
import getRating from './rate/get.rating' //Wyświetlanie ocen

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
const apiRoutes = [getStatus, postUser, loginUser, postAddress, postAddProduct, postOrder, postRate, getRating]

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
)

export default router
