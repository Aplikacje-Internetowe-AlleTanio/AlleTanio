import { Request, Response } from 'express'
import { query } from 'express-validator'
import axios from 'axios'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

export default {
    method: 'get',
    path: '/api/products',
    validators: [
        authorize,
        query('name').optional().not().isEmpty(),
        query('fastDelivery').optional().isBoolean(),
        query('price').optional().isNumeric(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            execute: async () => {
                const { name, fastDelivery, price } = req.query

                let filters: any = {}

                if (name) {
                    filters.name = String(name)
                }

                if (fastDelivery !== undefined) {
                    filters.fastDelivery = Boolean(fastDelivery)
                }

                if (price) {
                    filters.price = Number(price)
                }

                const { data } = await axios.get(
                    'https://api.open-meteo.com/v1/forecast?latitude=52.45&longitude=16.92&hourly=rain&current_weather=true&forecast_days=1'
                )

                const currentWeather = data.current_weather
                const weatherCode = currentWeather.weathercode

                let products = await prisma.product.findMany({
                    where: filters,
                })

                if ([61, 63, 65].includes(weatherCode)) {
                    console.log(weatherCode + ' - Pada');
                    products = products.map((product: any) => {
                        if (product.category === 'na_deszcz') {
                            const increasedPrice = product.price * 1.1 // Zwiększenie ceny o 10%
                            return { ...product, price: increasedPrice }
                        }
                        return product
                    })
                }
                else{
                    console.log(weatherCode + 'Nie pada');
                    products = products.map((product: any) => {
                        if(product.category === 'na_slonce'){
                            const  increasedPrice = product.price * 1.1
                            return {...product, price:increasedPrice}
                        }
                        return product
                    })
                }

                return products
            },
        }),
} as TRoute
