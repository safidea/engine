import React, { useState } from 'react'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { Form, FormInputValue } from '@domain/entities/page/components/Form'
import { Context } from '@domain/entities/page/Context'

export class RenderPageForm {
  constructor(private fetcherGateway: FetcherGateway) {}

  async execute(form: Form, context: Context): Promise<() => JSX.Element> {
    const UI = form.renderUI()
    const { table, inputs, recordIdToUpdate } = form
    const InputComponents = inputs.map((input) => input.renderUI())
    const createRecord = this.fetcherGateway.createTableRecord(table)
    let defaultValue = {}
    if (recordIdToUpdate) {
      const recordId = context.getValue(recordIdToUpdate)
      defaultValue = await this.fetcherGateway.getTableRecord(table, recordId)
    }
    return function FormComponent() {
      const [isSaving, setIsSaving] = useState(false)
      const [formData, setFormData] = useState(defaultValue)
      const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

      const saveRecord = async () => {
        setIsSaving(true)
        const { error } = await createRecord(formData)
        if (error) {
          setErrorMessage(error)
        } else {
          setFormData({})
        }
        setIsSaving(false)
      }

      const handleChange = (name: string, value: FormInputValue) => {
        const updatedData = { ...formData, [name]: value }
        setFormData(updatedData)
      }

      const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        await saveRecord()
      }

      return (
        <UI
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          InputComponents={InputComponents}
          isSaving={isSaving}
          errorMessage={errorMessage}
          formData={formData}
        />
      )
    }
  }
}
