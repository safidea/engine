import React, { useState } from 'react'
import { Form, FormInputValue } from '@domain/entities/page/components/Form'
import { Context } from '@domain/entities/page/Context'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'
import { Record } from '@domain/entities/app/Record'

export class RenderPageForm {
  constructor(private fetcherGateway: FetcherGatewayAbstract) {}

  async execute(form: Form, context: Context): Promise<() => JSX.Element> {
    const UI = form.renderUI()
    const { table, inputs, recordIdToUpdate } = form
    const InputComponents = inputs.map((input) => input.renderUI())
    const createRecord = this.fetcherGateway.createTableRecord(table)
    let recordToUpdate: Record
    if (recordIdToUpdate) {
      const recordId = context.getValue(recordIdToUpdate)
      const { record, error } = await this.fetcherGateway.getEnrichedTableRecord(table, recordId)
      if (error) {
        throw new Error(error)
      }
      if (record) recordToUpdate = record
    }
    return function FormComponent() {
      const [isSaving, setIsSaving] = useState(false)
      const [formData, setFormData] = useState(recordToUpdate.fields ?? {})
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
