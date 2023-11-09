import axios from 'axios'
import { parseString } from 'xml2js'

export class ProductsController {
    async getAllProducts(apiUrl: string, companyName: string) {
        const rawProducts: { data: string } = await axios.get(apiUrl)
        const { data } = rawProducts

        if (typeof data == 'object') return this.toDto(data, companyName)

        const parsedXml = this.tryParseXml(data)
        const parsedJson = this.tryParseJson(data)

        if (parsedXml) return this.toDto(parsedXml, companyName)
        if (parsedJson) return this.toDto(parsedJson, companyName)
        return this.toDto(this.parseCsv(data), companyName)
    }

    private parseCsv(data: string) {
        const parsedData = data.split('\r\n')
        const keys = parsedData[0].split(',')
        const values = parsedData.slice(1).map((x) => x.split(','))
        const formattedProducts = values.map((x) => (
            this.createObject(keys, x)
        ))
        return formattedProducts
    }

    private createObject(keys: string[], values: string[]) {
        const obj = {}
        for (let i = 0; i < keys.length; i++) {
            Object.assign(obj, {[keys[i]]: values[i]})
        }
        return obj
    }

    private tryParseJson(data: string) {
        let parsedData
        try {
            parsedData = JSON.parse(data)
        } catch {}
        return parsedData
    }

    private tryParseXml(data: string) {
        let parsedXml
        parseString(data,
            {
                explicitArray: false,
                explicitRoot: false,
                normalizeTags: true
            },
            (err, result) => {
                if (!err) parsedXml = result.product
            }
        )
        return parsedXml
    }

    private toDto(products: object, companyName: string) {
        return {
            'company_name': companyName,
            products
        }
    }
}
