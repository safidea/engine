import React, { useState } from 'react'
import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { Form } from '@domain/entities/page/components/Form'

export class RenderPageForm {
  constructor(private pageGateway: PageGateway) {}

  execute(form: Form): () => JSX.Element {
    const UI = form.renderUI()
    const { table, inputs } = form
    const InputComponents = inputs.map((input) => input.renderUI())
    return function Component() {
      const [isSaving, setIsSaving] = useState(false)
      const [formData, setFormData] = useState({})

      const saveRecord = async (record: Record<string, string | { [key: string]: string }[]>) => {
        if (!isSaving) setIsSaving(true)
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
          const { error, details } = await res.json()
          console.log(error, details)
        }
        setIsSaving(false)
      }

      const handleChange = (name: string, value: string | { [key: string]: string }[]) => {
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
        />
      )
    }
  }
}
