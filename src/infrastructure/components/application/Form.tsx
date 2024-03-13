import type { Props } from '@infrastructure/engine'

export const Form = ({
  Title,
  Paragraph,
  Inputs,
  Buttons,
  successMessage,
  action,
  method,
}: Props['Form']) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      {Title && <Title className="mb-4" />}
      {Paragraph && <Paragraph className="mb-8" />}
      {successMessage ? (
        <p className="mb-8 lg:mb-16 text-center">{successMessage}</p>
      ) : (
        <form action={action} method={method} className="space-y-8">
          {Inputs.map((Input, index) => (
            <Input key={index} />
          ))}
          <div className="flex justify-end space-x-4">
            {Buttons.map((Button, index) => (
              <Button key={index} />
            ))}
          </div>
        </form>
      )}
    </div>
  </section>
)
