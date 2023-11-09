import { parseString } from 'xml2js'
import Order from '../models/order'
import axios from 'axios'

export class NewOrderController {
    async receiveNewOrder(xmlFormatOrder: { id: number } | string) {
        if (typeof xmlFormatOrder !== 'string' && xmlFormatOrder?.id) {
            // console.log(await this.getOrder(xmlFormatOrder.id))
            return await this.getOrder(xmlFormatOrder.id)
        }
        else if (typeof xmlFormatOrder === 'string') {
            const parsedXml = this.tryParseXml(xmlFormatOrder)
            if (parsedXml?.id) return await this.getOrder(parsedXml.id)
        }
        return this.notOk('Unable to read order id')
    }

    private async getOrderAndPassToErp(orderId: number): Promise<boolean> {
        const orderDetails = await Order.findOne({orderId}).select('orderId customer product -_id')
        if (!orderDetails) return false
        const erpResponse = await axios.post('http://localhost:3004/erp/order/create', orderDetails)
        console.log(erpResponse.data)
        return true
    }

    private tryParseXml(data: string): { id: number } | undefined {
        let parsedXml
        parseString(data,
            {
                explicitArray: false,
                explicitRoot: false,
                normalizeTags: true
            },
            (err, result) => {
                if (!err) parsedXml = result
            }
        )
        return parsedXml
    }

    private notOk(message: string) {
        // console.log(message)
        return {
            status: 'Not OK',
            message
        }
    }

    private async getOrder(id: number) {
        const orderFound = await this.getOrderAndPassToErp(id)
        // console.log(orderFound)
        if (!orderFound) return this.notOk('Order not found')
        // console.log('befoire return')

        return {
            id,
            status: 'OK',
            message: 'Order received'
        }
    }
}
