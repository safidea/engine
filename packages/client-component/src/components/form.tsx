'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import type { CommonPropsType } from '../types/common.type'

export type CreateProps = CommonPropsType & {
  table: string
  fields: string[]
  database: string
}

// This component is used to create a new item from a form with the given fields and database.
export default async function Create({ table, fields }: CreateProps) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    console.log('formData', formData)
  }

  const handleChange = (event: any) => {
    console.log(event.target.name, event.target.value)
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={`field${index}`} className="block font-medium mb-1">
              {field}
            </label>
            <input
              type="text"
              name={field}
              id={`field${index}`}
              className="w-full px-4 py-2 border rounded"
              onChange={handleChange}
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
