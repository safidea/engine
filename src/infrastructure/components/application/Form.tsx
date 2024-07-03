import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Form = ({
  id,
  className = '',
  Title,
  Paragraph,
  Inputs,
  Buttons,
  successMessage,
  action,
  method,
  formId,
}: Props['Form']) => (
  <section id={id} className={classNames('bg-white dark:bg-gray-900', className)} data-component="Form">
    <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      {Title && <Title className="mb-4" />}
      {Paragraph && <Paragraph className="mb-8" />}
      {successMessage ? (
        <p className="mb-8 lg:mb-16 text-center">{successMessage}</p>
      ) : (
        <div className="space-y-8">
          <form id={formId} action={action} method={method} className="space-y-8">
            {Inputs.map((Input, index) => (
              <Input key={index} />
            ))}
          </form>
          <div className="flex justify-end space-x-4">
            {Buttons.map((Button, index) => (
              <Button key={index} formId={formId} />
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
)
