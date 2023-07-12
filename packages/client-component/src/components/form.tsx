import { useState, useRef } from 'react'
import useSWR from 'swr'
import Table from './Table'

import type { FormProps, FormField } from 'shared-component'

type FieldsProps = FormProps & {
  defaultFieldValues?: Record<string, string>
}

type FieldProps = {
  field: FormField
  value: string | { [key: string]: string }[]
  handleChange: (name: string, value: string | { [key: string]: string }[]) => void
}

function Field({ field, value, handleChange }: FieldProps) {
  switch (field.type) {
    case 'table': {
      if (!field.table) throw new Error('Link field must have a table')
      if (!field.fields) throw new Error('Link field must have fields')
      return (
        <div className="mb-4">
          <Table
            table={field.table}
            fields={field.fields}
            addLabel={field.addLabel}
            label={field.label}
            submit={field.submit}
            onDataChange={(data: { [key: string]: string }[]) => handleChange(field.key, data)}
          />
        </div>
      )
    }
    default:
      return (
        <div className="mb-4">
          <label htmlFor={field.key} className="block font-medium mb-1">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.key}
            id={field.key}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            value={String(value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      )
  }
}

function Fields({ table, fields, router, submit, defaultFieldValues, pathParams }: FieldsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [error, setError] = useState({ message: '', details: '' })
  const defaultValues = fields.reduce(
    (acc, field) => {
      acc[field.key] = field.type === 'table' ? [] : defaultFieldValues?.[field.key] ?? ''
      return acc
    },
    {} as Record<string, string | { [key: string]: string }[]>
  )
  const [formData, setFormData] = useState(defaultValues)

  const saveData = async (data: Record<string, string | { [key: string]: string }[]>) => {
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

  const handleChange = (name: string, value: string | { [key: string]: string }[]) => {
    const updatedData = { ...formData, [name]: value }
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
          <Field
            key={index}
            field={field}
            value={formData[field.key]}
            handleChange={handleChange}
          />
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
