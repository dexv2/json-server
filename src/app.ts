import './config/mongo'
import express from 'express'
import { ProductsRouter } from './routes'
import { ProductsController } from './controllers/productsController'
import { XmlToDatabaseAutomation } from './automation'
import { XmlToDatabaseController } from './controllers/xmlToDatabaseController'
import { NewOrderRouter } from './routes/newOrder'
import { NewOrderController } from './controllers/newOrderController'
import bodyParser from 'body-parser'
import bodyParserXml from 'body-parser-xml'

bodyParserXml(bodyParser)

const app = express()

app.use(express.json())
app.use(bodyParser.xml({
    xmlParseOptions: {
        explicitArray: false,
        explicitRoot: false
    }
}))
app.use(express.text())

const xmlToDatabaseController = new XmlToDatabaseController()
new XmlToDatabaseAutomation(xmlToDatabaseController)
const productsController = new ProductsController()
const productsRouter = new ProductsRouter(productsController)
const newOrderController = new NewOrderController()
const newOrderRouter = new NewOrderRouter(newOrderController)

app.use(ProductsRouter.basePath, productsRouter.router)
app.use(NewOrderRouter.basePath, newOrderRouter.router)

const port = process.env.PORT || 3003

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
