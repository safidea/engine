import type { CommonPropsType } from '../types/common.type'

export type CreateProps = CommonPropsType & {
  table: string
  // TODO: infer the type from the json schema
  fields: {
    key: string
    label: string
  }[]
}

export default function FormComponent({ fields, router }: CreateProps) {
  const handlingForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router?.push('/')
  }

  return (
    <div className="p-4">
      <form onSubmit={handlingForm} className="w-full max-w-lg mx-auto">
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={`field${index}`} className="block font-medium mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.key}
              id={`field${index}`}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  )
}
