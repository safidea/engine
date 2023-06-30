import { useState } from 'react'
import type { CommonPropsType } from '../types/common.type'

export type CreateProps = CommonPropsType & {
  table: string
  // TODO: infer the type from the json schema
  fields: {
    key: string
    label: string
  }[]
  router: {
    push: (path: string) => void
  }
}

export default function FormComponent({ table, fields, router }: CreateProps) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.key] = ''
      return acc
    }, {} as Record<string, string>)
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    console.log('handleSubmit')
    try {
      console.log('Form data submitted:', formData)
      await fetch(`/api/table/${table}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      router.push('/')
      //window.location.href = '/'
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-4">
      <div className="w-full max-w-lg mx-auto">
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={field.key} className="block font-medium mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.key}
              id={field.key}
              onChange={handleChange}
              value={formData[field.key]}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        ))}
        <button
          role="submit"
          disabled={!handleSubmit || !router}
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  )
}
