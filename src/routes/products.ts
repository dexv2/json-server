import { Router } from 'express'
import { ProductsController } from '../controllers/productsController'

export class ProductsRouter {
    static basePath = '/api/products'
    router: Router

    constructor(private productsController: ProductsController) {
        this.router = Router()
        this.getAllProducts()
    }

    private getAllProducts() {
        this.router.post('/', async (req, res) => {
            console.log(req.body)
            const { apiUrl, companyName } = req.body
            res.send(await this.productsController.getAllProducts(apiUrl, companyName))
        })
    }
}
