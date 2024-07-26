import OpenAI from 'openai'
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface Prompt {
  system: string
  user: string
}

export const getChatGPTResponse = async ({ system, user }: Prompt): Promise<string> => {
  let completeResponse = ''
  let i = 0
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]

  while (true) {
    console.log(`${++i} request to OpenAI with ${messages.length} messages...`)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    } as ChatCompletionCreateParamsBase)

    if ('choices' in response) {
      const message = response.choices[0].message.content!
      completeResponse += message.trim()
      console.log(`OpenAI response with ${completeResponse.length} tokens`)
      if (response.choices[0].finish_reason === 'stop') {
        break
      }
      messages.push({ role: 'assistant', content: message })
      messages.push({ role: 'user', content: 'Continue the previous response' })
    } else {
      console.error(response)
      throw new Error('Invalid response from OpenAI')
    }
  }

  try {
    // Parse the final complete response
    return completeResponse
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    throw new Error('Failed to parse JSON response from OpenAI')
  }
}
