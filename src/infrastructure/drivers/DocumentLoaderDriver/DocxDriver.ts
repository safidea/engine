import type { Driver } from '@adapter/spi/drivers/DocumentSpi'
import fs from 'fs-extra'
import AdmZip from 'adm-zip'

export class DocxDriver implements Driver {
  private _zip: AdmZip

  constructor(path: string) {
    if (!fs.existsSync(path)) throw new Error('File not found')
    if (!path.endsWith('.docx')) throw new Error('File must be a .docx')
    this._zip = new AdmZip(path)
  }

  readText = () => {
    const docXmlEntry = this._zip.getEntry('word/document.xml')
    if (!docXmlEntry) throw new Error('document.xml not found in the .docx file')
    return docXmlEntry.getData().toString('utf8')
  }

  writeText = (xml: string) => {
    this._zip.updateFile('word/document.xml', Buffer.from(xml, 'utf8'))
  }

  toBuffer = () => {
    return this._zip.toBuffer()
  }
}
