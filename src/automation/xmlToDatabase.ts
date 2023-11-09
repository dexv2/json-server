import { XmlToDatabaseController } from '../controllers/xmlToDatabaseController'

export class XmlToDatabaseAutomation {
    constructor(private xmlToDatabaseController: XmlToDatabaseController) {
        this.saveXmlDataToDatabase()
    }

    private async saveXmlDataToDatabase() {
        await this.xmlToDatabaseController.saveXmlDataToDatabase()
    }
}
