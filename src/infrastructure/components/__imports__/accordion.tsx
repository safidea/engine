export interface Props {
  example:
    | 'basic-usage-example'
    | 'always-open'
    | 'nested'
    | 'no-arrow'
    | 'with-arrow'
    | 'with-title-and-arrow-stretched'
    | 'bordered'
    | 'active-content-bordered'
}

export const Accordion = ({ example }: Props) => {
  if (example === 'basic-usage-example') {
    return (
      <div className="hs-accordion-group">
        <div className="hs-accordion active" id="hs-basic-heading-one">
          <button
            className="hs-accordion-toggle hs-accordion-active:text-blue-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
            aria-expanded="true"
            aria-controls="hs-basic-collapse-one"
          >
            <svg
              className="hs-accordion-active:hidden block size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            <svg
              className="hs-accordion-active:block hidden size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14"></path>
            </svg>
            Accordion #1
          </button>
          <div
            id="hs-basic-collapse-one"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
            role="region"
            aria-labelledby="hs-basic-heading-one"
          >
            <p className="text-gray-800 dark:text-neutral-200">
              <em>This is the third item's accordion body.</em> It is hidden by default, until the
              collapse plugin adds the appropriate classes that we use to style each element. These
              classes control the overall appearance, as well as the showing and hiding via CSS
              transitions.
            </p>
          </div>
        </div>
        /* Additional accordion items follow the same structure */
      </div>
    )
  }

  if (example === 'always-open') {
    return (
      <div className="hs-accordion-group" data-hs-accordion-always-open="">
        <div className="hs-accordion active" id="hs-basic-always-open-heading-one">
          <button
            className="hs-accordion-toggle hs-accordion-active:text-blue-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
            aria-expanded="true"
            aria-controls="hs-basic-always-open-collapse-one"
          >
            <svg
              className="hs-accordion-active:hidden block size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            <svg
              className="hs-accordion-active:block hidden size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14"></path>
            </svg>
            Accordion #1
          </button>
          <div
            id="hs-basic-always-open-collapse-one"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
            role="region"
            aria-labelledby="hs-basic-always-open-heading-one"
          >
            <p className="text-gray-800 dark:text-neutral-200">
              <em>This is the third item's accordion body.</em> It is hidden by default, until the
              collapse plugin adds the appropriate classes that we use to style each element. These
              classes control the overall appearance, as well as the showing and hiding via CSS
              transitions.
            </p>
          </div>
        </div>
        /* Additional accordion items follow the same structure */
      </div>
    )
  }

  /* Similar implementations for the other styles */
}
