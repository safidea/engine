import { classNames } from '../utils'

type AccordionProps = {
  items: Array<{
    title: string
    content: string
    isActive: boolean
    hasArrow?: boolean
    isBordered?: boolean
    alwaysOpen?: boolean
    nestedItems?: Array<{ title: string; content: string; isActive: boolean }>
  }>
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div
      className={classNames(
        'hs-accordion-group',
        ...(items.some((item) => item.alwaysOpen) ? ['data-hs-accordion-always-open'] : [])
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={classNames(
            'hs-accordion',
            item.isActive ? 'active' : '',
            item.isBordered ? 'border bg-white dark:bg-neutral-800 dark:border-neutral-700' : '',
            item.isBordered && !item.isActive ? '-mt-px first:rounded-t-lg last:rounded-b-lg' : '',
            item.isActive && item.isBordered
              ? 'hs-accordion-active:border-gray-200 dark:hs-accordion-active:border-neutral-700'
              : '',
            !item.isBordered && !item.hasArrow && !item.isActive ? 'rounded-lg' : '',
            !item.isBordered && item.hasArrow && !item.isActive ? 'rounded-xl' : ''
          )}
          id={`hs-heading-${idx}`}
        >
          <button
            className={classNames(
              'hs-accordion-toggle py-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400',
              item.isActive
                ? 'hs-accordion-active:text-blue-600 dark:hs-accordion-active:text-blue-500'
                : '',
              item.isBordered ? 'py-4 px-5' : '',
              item.isBordered || item.isActive || item.hasArrow
                ? 'inline-flex items-center gap-x-3'
                : 'inline-flex items-center gap-x-3 justify-between'
            )}
            aria-expanded={item.isActive}
            aria-controls={`hs-collapse-${idx}`}
          >
            {item.hasArrow && (
              <>
                <svg
                  className={classNames(
                    item.isActive ? 'hidden' : 'block',
                    'hs-accordion-active:hidden',
                    !item.isBordered ? 'size-3.5' : 'size-4'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  {item.isActive && <path d="M12 5v14"></path>}
                </svg>
                <svg
                  className={classNames(
                    item.isActive ? 'block' : 'hidden',
                    'hs-accordion-active:block'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
              </>
            )}
            {item.title}
          </button>
          <div
            id={`hs-collapse-${idx}`}
            className={classNames(
              'hs-accordion-content w-full overflow-hidden transition-[height] duration-300',
              item.isActive ? '' : 'hidden'
            )}
            role="region"
            aria-labelledby={`hs-heading-${idx}`}
          >
            <div className={classNames(item.isBordered ? 'pb-4 px-5' : '')}>
              <p className="text-gray-800 dark:text-neutral-200">{item.content}</p>
            </div>
            {item.nestedItems && (
              <div className="hs-accordion-group ps-6">
                {item.nestedItems.map((nestedItem, nIdx) => (
                  <div key={nIdx} className="hs-accordion">
                    <button
                      className={classNames(
                        'hs-accordion-toggle py-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400',
                        nestedItem.isActive
                          ? 'hs-accordion-active:text-blue-600 dark:hs-accordion-active:text-blue-500'
                          : '',
                        'inline-flex items-center gap-x-3'
                      )}
                      aria-expanded={nestedItem.isActive}
                      aria-controls={`hs-nested-collapse-${nIdx}`}
                    >
                      <svg
                        className={classNames(
                          nestedItem.isActive ? 'hidden' : 'block',
                          'size-3',
                          'hs-accordion-active:hidden'
                        )}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.62421 7.86L13.6242 7.85999"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M8.12421 13.36V2.35999"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                      <svg
                        className={classNames(
                          nestedItem.isActive ? 'block' : 'hidden',
                          'size-3',
                          'hs-accordion-active:block'
                        )}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.62421 7.86L13.6242 7.85999"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                      {nestedItem.title}
                    </button>
                    <div
                      id={`hs-nested-collapse-${nIdx}`}
                      className={classNames(
                        'hs-accordion-content w-full overflow-hidden transition-[height] duration-300',
                        nestedItem.isActive ? '' : 'hidden'
                      )}
                      role="region"
                      aria-labelledby={`hs-heading-${nIdx}`}
                    >
                      <p className="text-gray-800 dark:text-neutral-200">{nestedItem.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Accordion
