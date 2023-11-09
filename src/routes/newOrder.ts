import { Router } from 'express'
import { NewOrderController } from '../controllers/newOrderController'

export class NewOrderRouter {
    static basePath = '/api/order'
    router: Router

    constructor(private newOrderController: NewOrderController) {
        this.router = Router()
        this.receiveNewOrder()
    }

    private receiveNewOrder() {
        this.router.post('/new', async (req, res) => {
            const xmlFormatOrder: { id: number } | string = req.body
            res.send(await this.newOrderController.receiveNewOrder(xmlFormatOrder))
        })
    }
}
