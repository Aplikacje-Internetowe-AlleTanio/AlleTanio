import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import limit from 'express-rate-limit'
import { CorsOptions } from 'cors'
import router from './routes'
import bodyParser from 'body-parser'

export type TServerConfig = {
    port: number
    corsOptions: CorsOptions
    limiter: {
        time: number
        max: number
    }
}
export const startServer = ({ port, corsOptions, limiter }: TServerConfig) => {
    const app = express()
    app.use(helmet())
    app.use(cors(corsOptions))
    app.disable('x-powered-by')
    app.use(limit({ windowMs: limiter.time, max: limiter.max }))

    app.use(express.json())
    app.use(bodyParser.json()); // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

    app.use(router)
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}
