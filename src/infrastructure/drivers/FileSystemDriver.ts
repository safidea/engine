import type { Driver } from '@adapter/spi/FileSystemSpi'
import fs from 'fs-extra'
import AdmZip from 'adm-zip'

export class FileSystemDriver implements Driver {
  exists = (path: string) => {
    return fs.existsSync(path)
  }

  read = (path: string) => {
    if (!fs.existsSync(path)) throw new Error('File not found')
    if (path.includes('.docx')) {
      const zip = new AdmZip(path)
      const docXmlEntry = zip.getEntry('word/document.xml')
      if (!docXmlEntry) throw new Error('document.xml not found in the .docx file')
      return docXmlEntry.getData()
    }
    return fs.readFileSync(path)
  }

  update = (path: string, content: string) => {
    if (path.includes('.docx')) {
      const zip = new AdmZip(path)
      zip.updateFile('word/document.xml', Buffer.from(content, 'utf8'))
      return zip.toBuffer()
    }
  }
}
