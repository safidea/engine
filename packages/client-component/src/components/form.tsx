import { useState, useRef } from 'react'
import useSWR from 'swr'

import type { FormProps } from 'shared-component'

type FieldsProps = FormProps & {
  defaultFieldValues?: Record<string, string>
}

function Fields({ table, fields, router, submit, defaultFieldValues, pathParams }: FieldsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [error, setError] = useState({ message: '', details: '' })
  const defaultValues = fields.reduce((acc, field) => {
    acc[field.key] = defaultFieldValues?.[field.key] ?? ''
    return acc
  }, {} as Record<string, string>)
  const [formData, setFormData] = useState(defaultValues)

  const saveData = async (data: Record<string, string>) => {
    setIsSaving(true)
    const url = `/api/table/${table}` + (submit.type === 'update' ? `/${pathParams?.id}` : '')
    const method = submit.type === 'update' ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status !== 200) {
      const { error, details } = await res.json()
      setError({ message: error, details })
    } else if (submit?.actionsOnSuccess) {
      for (const action of submit.actionsOnSuccess) {
        switch (action.type) {
          case 'redirect':
            router.push(action.path)
            break
          default:
            break
        }
      }
    }
    setIsSaving(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value }
    setFormData(updatedData)
    if (submit.autosave === true) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsSaving(true)
      timeoutRef.current = setTimeout(() => saveData(updatedData), 1000)
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    saveData(formData)
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
        {submit.label ? (
          <button
            type="submit"
            className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isSaving}
          >
            {isSaving ? submit.savingLabel ?? 'Saving...' : submit.label ?? 'Save'}
          </button>
        ) : submit.autosave === true && isSaving ? (
          <div className="px-4 py-2 mb-4 bg-blue-500 text-white rounded">
            {submit.savingLabel ?? 'Saving...'}
          </div>
        ) : null}
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

function Create(props: FormProps) {
  return <Fields {...props} />
}

function Update({ table, pathParams, ...props }: FormProps) {
  const {
    data,
    error: dataError,
    isLoading: isDataLoading,
  } = useSWR(`/api/table/${table}/${pathParams?.id}`)
  if (isDataLoading) return <div>Loading...</div>
  if (dataError) return <div>Failed to load</div>
  return <Fields table={table} pathParams={pathParams} defaultFieldValues={data} {...props} />
}

export default function Form(props: FormProps) {
  if (props.pathParams?.id) {
    return <Update {...props} />
  }
  return <Create {...props} />
}
