import type { HTMLInputType } from '../utils'

export interface FormProps {
  title: string
  description: string
  inputs: {
    name: string
    type?: HTMLInputType
    placeholder?: string
    label?: string
    required?: boolean
  }[]
  submitButton: {
    label: string
  }
  successMessage?: string
}

export interface IForm extends FormProps {
  component: 'Form'
}

export const Form = ({ title, description, inputs, submitButton, successMessage }: FormProps) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
        {description}
      </p>
      {successMessage ? (
        <p className="mb-8 lg:mb-16 text-center sm:text-xl">{successMessage}</p>
      ) : (
        <form action="#" className="space-y-8">
          {inputs.map((input) => (
            <div key={input.name}>
              {input.label ? (
                <label
                  htmlFor={input.name}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {input.label}
                </label>
              ) : null}
              <input
                id={input.name}
                type={input.type}
                name={input.name}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder={input.placeholder}
                required={input.required}
              />
            </div>
          ))}
          <button
            type="submit"
            className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            {submitButton.label}
          </button>
        </form>
      )}
    </div>
  </section>
)
