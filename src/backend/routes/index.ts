import express from 'express'
import { getStatus } from './status/get.status'
import { postUser } from './user/post.user'
import { postProduct } from './product/post.add_product'

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
router.get('/api/status', getStatus)

router.post('/api/user', postUser)
router.post('/api/product', postProduct)
export default router
