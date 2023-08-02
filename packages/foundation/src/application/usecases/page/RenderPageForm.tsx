import React, { useState } from 'react'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { Form, FormInputValue } from '@domain/entities/page/components/Form'
import { RecordToCreateDto } from '@application/dtos/table/RecordDto'

export class RenderPageForm {
  constructor(private fetcherGateway: FetcherGateway) {}

  execute(form: Form): () => JSX.Element {
    const UI = form.renderUI()
    const { table, inputs } = form
    const InputComponents = inputs.map((input) => input.renderUI())
    const createRecord = this.fetcherGateway.createTableRecord(table)
    return function Component() {
      const [isSaving, setIsSaving] = useState(false)
      const [formData, setFormData] = useState({})
      const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

      const saveRecord = async (record: RecordToCreateDto) => {
        setIsSaving(true)
        const { error } = await createRecord(record)
        if (error) {
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
