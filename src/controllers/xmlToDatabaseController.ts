import fs from 'fs'
import path from 'path'
import { parseString } from 'xml2js'
import Order from '../models/order'

export class XmlToDatabaseController {
    async saveXmlDataToDatabase() {
        const { xmlFilesDir, xmlFileNames } = this.getXmlFiles()
        this.readAndSaveXmlFilesToDatabase(xmlFilesDir, xmlFileNames)
    }

    private getXmlFiles() {
        const rootDir = this.upDirectory(__dirname, 2)
        const xmlFilesDir = rootDir + '/src/files/xml/'
        const xmlFileNames = fs.readdirSync(xmlFilesDir)
        return { xmlFilesDir, xmlFileNames }
    }

    private async readAndSaveXmlFilesToDatabase(xmlFilesDir: string, xmlFileNames: string[]) {
        await this.getAllOrders()
        for (let i = 0; i < xmlFileNames.length; i++) {
            fs.readFile(xmlFilesDir + xmlFileNames[i], 'utf-8', (err, data) => {
                parseString(
                    data,
                    {
                        explicitArray: false,
                        explicitRoot: false,
                        normalizeTags: true
                    },
                    async (err, result) => {
                        await this.saveToDatabase(result, xmlFileNames[i])
                    }
                )
            })
        }
    }

    private async saveToDatabase(order: any, fileName: string) {
        const formattedOrder = {
            orderId: order.order_id,
            fileName,
            ...order
        }
        const newOrder = new Order(formattedOrder)
        await newOrder.save().catch((err) => {console.log(`MongoServerError at code: ${err.code}`)})
    }

    private upDirectory(presentDir: string, level: number) {
        for (let i = 0; i < level; i++) {
            presentDir = path.dirname(presentDir)
        }
        return presentDir
    }

    private async getAllOrders() {
        console.log('order')
        const orders = await Order.find({}).select('fileName -_id').set('s')
        // const orders = await Order.aggregate([
        //     // {
        //     //     $group: {_id: null, values: $push: {$cond: [{}, $filename]}}
        //     // }
        //     {
        //         '$group': {
        //             _id: null,
        //             'values': {
        //                 '$push': {
        //                     '$cond': [
        //                         {},
        //                         '$fileName',
        //                         '$$REMOVE'
        //                     ]
        //                 }
        //             }
        //         }
        //     }
        // ])
        // const orders = await Order.aggregate()
        //     .group({_id: null, values: { $push: '$fileName' }})
        //     .project('-_id values')
        console.log(orders)
    }
}
