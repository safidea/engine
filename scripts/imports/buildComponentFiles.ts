import fs from 'fs-extra'
import { join } from 'path'
import OpenAI from 'openai'

// TODO
// 1. Scrap all the HTML pages from the Preline website
// 2. Extract all the components html examples (tag "code")
// 3. Ask OpenAI to merge the HTML to create a new component : https://chatgpt.com/share/c692ede6-b537-4624-bba5-21dbf715536b

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const uploadFilesToOpenAI = async (filePaths: string[]) => {
  const fileIds = []
  for (const filePath of filePaths) {
    const response = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'fine-tune',
    })
    if (!response.id) {
      console.error(response)
      throw new Error('Failed to upload file to OpenAI')
    }
    fileIds.push(response.id)
  }
  return fileIds
}

const getChatGPTResponse = async (prompt: string, filePaths: string[]) => {
  try {
    const fileIds = await uploadFilesToOpenAI(filePaths)
    const fileReferences = fileIds.map((fileId) => `Use the file with ID: ${fileId}`).join('\n')

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt },
        { role: 'system', content: fileReferences },
      ],
      response_format: { type: 'json_object' },
    })

    if (!response.choices) {
      console.error(response)
      throw new Error('Invalid response from OpenAI')
    }

    return response.choices[0].message.content
  } catch (error) {
    console.error(error)
    throw new Error('Failed to get response from OpenAI')
  }
}

const saveHtmlInFile = async (url: string, name: string) => {
  const response = await fetch(url)
  const html = await response.text()
  const path = join(__dirname, 'pages', `${name}.html`)
  await fs.ensureDir(join(process.cwd(), 'pages'))
  await fs.writeFile(path, html)
  return path
}

const main = async (page: string) => {
  const component = page.split('/').pop()?.split('.')[0]
  if (!component) {
    throw new Error('Failed to extract component name')
  }
  console.log(`Extracting component: ${component}`)

  const path = await saveHtmlInFile(page, component)
  const prompt = `extract all the h2 titles and return them as an array from the file ${component}.html`
  const styles = await getChatGPTResponse(prompt, [path])
  console.log(styles)
}

const page = 'https://preline.co/docs/accordion.html'

main(page)
