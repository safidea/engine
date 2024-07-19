import type { Props } from '@domain/entities/Component'

export const Input = ({
  id,
  className,
  name,
  label,
  type,
  placeholder,
  required,
  defaultValue,
}: Props['Input']) => {
  return (
    <div className={className} data-component="Input">
      {label ? (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {label}
        </label>
      ) : null}
      {type === 'textarea' ? (
        <textarea
          rows={4}
          name={name}
          id={id ?? name}
          placeholder={placeholder}
          required={required}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          defaultValue={defaultValue}
        ></textarea>
      ) : (
        <input
          id={id ?? name}
          type={type}
          name={name}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
        />
      )}
    </div>
  )
}
