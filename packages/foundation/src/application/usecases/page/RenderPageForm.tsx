import React, { useState } from 'react'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { Form, FormInputValue } from '@domain/entities/page/components/Form'

export class RenderPageForm {
  constructor(private fetcherGateway: FetcherGateway) {}

  execute(form: Form): () => JSX.Element {
    const UI = form.renderUI()
    const { table, inputs } = form
    const InputComponents = inputs.map((input) => input.renderUI())
    return function Component() {
      const [isSaving, setIsSaving] = useState(false)
      const [formData, setFormData] = useState({})
      const [errorMessage, setErrorMessage] = useState(undefined)

      const saveRecord = async (record: Record<string, FormInputValue>) => {
        setIsSaving(true)
        const url = `/api/table/${table}`
        // TODO use the fetcher
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(record),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (res.status !== 200) {
          const { error } = await res.json()
          setErrorMessage(error)
        }
        setIsSaving(false)
      }

      const handleChange = (name: string, value: FormInputValue) => {
        const updatedData = { ...formData, [name]: value }
        setFormData(updatedData)
      }

      const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        await saveRecord(formData)
      }

      return (
        <UI
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          InputComponents={InputComponents}
          isSaving={isSaving}
          errorMessage={errorMessage}
        />
      )
    }
  }
}
