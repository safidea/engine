import AdmZip from 'adm-zip'
import xml2js from 'xml2js'

export class DocumentDriver {
  readDocxAsXml = async (filePath: string) => {
    try {
      // Load the .docx file as a zip
      const zip = new AdmZip(filePath)

      // Read the document.xml file from the .docx structure
      const docXmlEntry = zip.getEntry('word/document.xml')
      if (!docXmlEntry) {
        throw new Error('document.xml not found in the .docx file')
      }

      const docXmlContent = docXmlEntry.getData().toString('utf8')

      // Parse the XML content
      const parser = new xml2js.Parser()
      const result = await parser.parseStringPromise(docXmlContent)

      // Output the parsed XML
      console.log(JSON.stringify(result, null, 2))

      return result
    } catch (error) {
      console.error('Error reading or parsing .docx file:', error)
    }
  }
}
