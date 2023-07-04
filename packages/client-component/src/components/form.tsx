import { useState } from 'react'

import type { FormProps } from 'shared-component'

export default function Form({ table, fields, router, submit }: FormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ message: '', details: '' })
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await fetch(`/api/table/${table}`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    console.log(data)
    if (res.status !== 200) {
      setError({ message: data.error, details: data.details })
    } else {
      router.push('/')
    }
    setIsLoading(false)
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={field.key} className="block font-medium mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.key}
              id={field.key}
              onChange={handleChange}
              value={formData[field.key]}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? submit.loading_label ?? 'Loading...' : submit.label ?? 'Save'}
        </button>
        {error.message && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error.message}</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.details}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
