import type { Driver } from '@adapter/spi/ZipSpi'
import AdmZip from 'adm-zip'

export class ZipDriver implements Driver {
  readDocx = (path: string) => {
    const zip = new AdmZip(path)
    const docXmlEntry = zip.getEntry('word/document.xml')
    if (!docXmlEntry) throw new Error('document.xml not found in the .docx file')
    return docXmlEntry.getData().toString('utf8')
  }

  updateDocx = (path: string, content: string) => {
    const zip = new AdmZip(path)
    zip.updateFile('word/document.xml', Buffer.from(content, 'utf8'))
    return zip.toBuffer()
  }
}
