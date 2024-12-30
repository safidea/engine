import type { FilterDto } from '@domain/entities/Filter'
import type { NotionTablePageDto } from '@adapter/spi/dtos/NotionTablePageDto'
import type { INotionTableIntegration } from '@adapter/spi/integrations/NotionTableSpi'
import {
  type NotionTablePageProperties,
  type NotionTablePagePropertyValue,
} from '@domain/integrations/Notion/NotionTablePage'
import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
  PageObjectResponse,
  DatabaseObjectResponse,
  QueryDatabaseParameters,
  RichTextItemResponse,
  PartialUserObjectResponse,
  UserObjectResponse,
  QueryDatabaseResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { format, parse, formatISO } from 'date-fns'

export class NotionTableIntegration implements INotionTableIntegration {
  readonly id: string
  readonly name: string

  constructor(
    private _api: Client,
    private _database: DatabaseObjectResponse,
    private _retry: <T>(fn: () => Promise<T>) => Promise<T>
  ) {
    this.id = this._database.id.replace(/-/g, '')
    this.name = this._database.title.map((title) => title.plain_text).join('')
  }

  insert = async <T extends NotionTablePageProperties>(page: T) => {
    const properties = this._preprocessProperties(page)
    const insertedPage = await this._retry(() =>
      this._api.pages.create({
        parent: {
          database_id: this._database.id,
        },
        properties,
      })
    )
    return this._postprocessPage<T>(this._throwIfNotPageObjectResponse(insertedPage))
  }

  insertMany = async <T extends NotionTablePageProperties>(pages: T[]) => {
    const pagesinserted: Promise<NotionTablePageDto<T>>[] = []
    for (const page of pages) pagesinserted.push(this.insert(page))
    return Promise.all(pagesinserted)
  }

  update = async <T extends NotionTablePageProperties>(id: string, page: Partial<T>) => {
    const properties = this._preprocessProperties(page)
    const updatedPage = await this._retry(() =>
      this._api.pages.update({
        page_id: id,
        properties,
      })
    )
    return this._postprocessPage<T>(this._throwIfNotPageObjectResponse(updatedPage))
  }

  updateMany = async <T extends NotionTablePageProperties>(
    pages: { id: string; page: Partial<T> }[]
  ) => {
    const pagesUpdated: Promise<NotionTablePageDto<T>>[] = []
    for (const { id, page } of pages) pagesUpdated.push(this.update(id, page))
    return Promise.all(pagesUpdated)
  }

  retrieve = async <T extends NotionTablePageProperties>(id: string) => {
    const page = await this._retry(() => this._api.pages.retrieve({ page_id: id }))
    return this._postprocessPage<T>(this._throwIfNotPageObjectResponse(page))
  }

  archive = async (id: string) => {
    await this._retry(() =>
      this._api.pages.update({
        page_id: id,
        archived: true,
      })
    )
  }

  archiveMany = async (ids: string[]) => {
    const pagesArchived: Promise<void>[] = []
    for (const id of ids) pagesArchived.push(this.archive(id))
    return Promise.all(pagesArchived)
  }

  list = async <T extends NotionTablePageProperties>(filter?: FilterDto) => {
    const query: QueryDatabaseParameters = {
      database_id: this._database.id,
    }
    if (filter) {
      query.filter = this._convertFilter(filter)
    }
    let pages: QueryDatabaseResponse['results'] = []
    let cursor: string | undefined = undefined
    do {
      const response = await this._retry(() =>
        this._api.databases.query({
          ...query,
          start_cursor: cursor,
        })
      )
      pages = pages.concat(response.results)
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
    } while (cursor)
    return pages.map((page) => this._postprocessPage<T>(this._throwIfNotPageObjectResponse(page)))
  }

  private _preprocessProperties = (
    properties: NotionTablePageProperties
  ): CreatePageParameters['properties'] => {
    const pageProperties: CreatePageParameters['properties'] = {}
    for (const key in properties) {
      const property = this._database.properties[key]
      const setPropertyValue = (value: NotionTablePagePropertyValue) => {
        const { type } = property
        switch (property.type) {
          case 'title':
            return {
              title: value
                ? [
                    {
                      type: 'text',
                      text: {
                        content: String(value),
                        link: null,
                      },
                      annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: 'default',
                      },
                      plain_text: String(value),
                      href: null,
                    },
                  ]
                : [],
            }
          case 'rich_text':
            return {
              rich_text: value
                ? [
                    {
                      type: 'text',
                      text: {
                        content: String(value),
                        link: null,
                      },
                      annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: 'default',
                      },
                      plain_text: String(value),
                      href: null,
                    },
                  ]
                : [],
            }
          case 'number':
            return {
              number: value ? Number(value) : null,
            }
          case 'select':
            return {
              select: property.select.options.find((option) => option.name === value) || null,
            }
          case 'multi_select':
            return {
              multi_select: (Array.isArray(value) ? value : [])
                .map((name) => property.multi_select.options.find((option) => option.name === name))
                .filter((option) => !!option),
            }
          case 'date':
            if (value instanceof Date) {
              return {
                date: { start: formatISO(value, { representation: 'complete' }), end: null },
              }
            }
            if (typeof value === 'number') {
              return {
                date: {
                  start: formatISO(new Date(value), { representation: 'complete' }),
                  end: null,
                },
              }
            }
            if (typeof value === 'string') {
              if (value.includes('T') && value.includes('Z')) {
                return {
                  date: {
                    start: formatISO(parse(value, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date()), {
                      representation: 'complete',
                    }),
                    end: null,
                  },
                }
              } else if (value.includes('T')) {
                return {
                  date: {
                    start: formatISO(parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()), {
                      representation: 'complete',
                    }),
                    end: null,
                  },
                }
              } else {
                return {
                  date: {
                    start: formatISO(parse(value, 'yyyy-MM-dd', new Date()), {
                      representation: 'complete',
                    }),
                    end: null,
                  },
                }
              }
            }
            return {
              date: null,
            }
          case 'checkbox':
            return {
              checkbox: value === 'false' || value === '0' ? false : Boolean(value),
            }
          case 'url':
            return {
              url: value ? String(value) : null,
            }
          case 'email':
            return {
              email: value ? String(value) : null,
            }
          case 'phone_number':
            return {
              phone_number: value ? String(value) : null,
            }
          case 'relation':
            return {
              relation: (Array.isArray(value) ? value : [])
                .filter((relation) => !!relation)
                .map((id) => ({ id })),
            }
          case 'status':
            return {
              status: property.status.options.find((option) => option.name === value) || null,
            }
          case 'people':
            return {
              people: (Array.isArray(value) ? value : [])
                .filter((person) => !!person)
                .map((id) => ({ id, object: 'user' })),
            }
          case 'files':
            return {
              files: (Array.isArray(value) ? value : [])
                .map((file) => {
                  if (file && typeof file === 'object' && 'url' in file && 'name' in file) {
                    return {
                      name: file.name,
                      external: { url: file.url },
                    }
                  }
                  return null
                })
                .filter((file) => !!file),
            }
          default:
            throw new Error(`Property type "${type}" is not supported`)
        }
      }
      // TODO: manage all properties types
      // eslint-disable-next-line
      // @ts-ignore
      pageProperties[key] = property ? setPropertyValue(properties[key]) : null
    }
    return pageProperties
  }

  private _postprocessPage = <T extends NotionTablePageProperties>(
    page: PageObjectResponse
  ): NotionTablePageDto<T> => {
    const properties: NotionTablePageProperties = {}
    for (const key in page.properties) {
      const property = page.properties[key]
      const getPropertyValue = (property: NotionProperty): NotionTablePagePropertyValue => {
        const { type } = property
        switch (type) {
          case 'title':
            return property.title
              .map((title) => {
                if ('text' in title) {
                  return title.text.content
                }
                return ''
              })
              .join('')
          case 'checkbox':
            return property.checkbox
          case 'created_by':
            return property.created_by.id
          case 'created_time':
            return new Date(property.created_time)
          case 'date':
            return property.date?.start ? new Date(property.date.start) : null
          case 'email':
            return property.email
          case 'files':
            return property.files.map((file) => {
              if ('external' in file) {
                return {
                  name: file.name,
                  url: file.external.url,
                }
              }
              return {
                name: file.name,
                url: file.file.url,
              }
            })
          case 'formula':
            switch (property.formula.type) {
              case 'string':
                return property.formula.string
              case 'number':
                return property.formula.number
              case 'boolean':
                return property.formula.boolean
              case 'date':
                return property.formula.date?.start ? new Date(property.formula.date?.start) : null
            }
            break
          case 'last_edited_by':
            return property.last_edited_by.id
          case 'last_edited_time':
            return new Date(property.last_edited_time)
          case 'multi_select':
            return property.multi_select.map((select) => select.name)
          case 'number':
            return property.number
          case 'people':
            return property.people.map((person) => person.id)
          case 'phone_number':
            return property.phone_number
          case 'relation':
            return property.relation.map((relation) => relation.id)
          case 'rollup':
            switch (property.rollup.type) {
              case 'array':
                return property.rollup.array?.map((item) => getPropertyValue(item)) || null
              case 'date':
                return property.rollup.date?.start || null
              case 'number':
                return property.rollup.number || null
            }
            break
          case 'rich_text':
            return (
              property.rich_text
                .map((text) => {
                  if ('text' in text) {
                    return text.text.content
                  }
                  return ''
                })
                .join('') || null
            )
          case 'select':
            return property.select?.name || null
          case 'url':
            return property.url
          case 'status':
            return property.status?.name || null
          case 'button':
            return null
          case 'unique_id':
            return (property.unique_id.prefix ?? '') + property.unique_id.number
          case 'verification':
            return property.verification?.state || null
          default:
            throw new Error(`Property type "${type}" is not supported`)
        }
      }
      properties[key] = getPropertyValue(property)
    }
    return {
      id: page.id.replace(/-/g, ''),
      properties: properties as T,
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      archived: page.archived,
    }
  }

  private _throwIfNotPageObjectResponse(
    page:
      | PageObjectResponse
      | PartialPageObjectResponse
      | PartialDatabaseObjectResponse
      | DatabaseObjectResponse
  ): PageObjectResponse {
    if (page.object === 'page' && 'properties' in page) {
      return page
    }
    throw new Error('Not a PageObjectResponse')
  }

  // TODO: fix two levels deep : https://developers.notion.com/reference/post-database-query-filter#compound-filter-conditions
  private _convertFilter = (filter: FilterDto): QueryDatabaseParameters['filter'] => {
    if ('and' in filter) {
      return {
        // eslint-disable-next-line
        // @ts-ignore
        and: filter.and.map(this._convertFilter),
      }
    } else if ('or' in filter) {
      return {
        // eslint-disable-next-line
        // @ts-ignore
        or: filter.or.map(this._convertFilter),
      }
    }

    const { operator, field } = filter
    const formatDate = (date: string) => format(new Date(date), "yyyy-MM-dd'T'HH:mm:00XXX")
    const property = this._database.properties[field]

    if (!property && field !== 'created_time' && field !== 'last_edited_time') {
      throw new Error(`Property "${field}" does not exist`)
    }

    switch (operator) {
      case 'Is': {
        if (property.type === 'title') {
          return {
            property: field,
            title: {
              equals: filter.value,
            },
          }
        } else if (property.type === 'formula') {
          return {
            property: field,
            formula: {
              string: {
                equals: filter.value,
              },
            },
          }
        } else if (property.type === 'rich_text') {
          return {
            property: field,
            rich_text: {
              equals: filter.value,
            },
          }
        } else if (property.type === 'select') {
          return {
            property: field,
            select: {
              equals: filter.value,
            },
          }
        } else if (property.type === 'status') {
          return {
            property: field,
            status: {
              equals: filter.value,
            },
          }
        }
        throw new Error(
          `Operator "${operator}" is not supported for property type "${property.type}"`
        )
      }
      case 'Contains': {
        if (property.type === 'rollup') {
          return {
            property: field,
            rollup: {
              any: {
                rich_text: {
                  contains: filter.value,
                },
              },
            },
          }
        } else if (property.type === 'rich_text') {
          return {
            property: field,
            rich_text: {
              contains: filter.value,
            },
          }
        } else if (property.type === 'title') {
          return {
            property: field,
            title: {
              contains: filter.value,
            },
          }
        } else if (property.type === 'formula') {
          return {
            property: field,
            formula: {
              string: {
                contains: filter.value,
              },
            },
          }
        } else if (property.type === 'multi_select') {
          return {
            property: field,
            multi_select: {
              contains: filter.value,
            },
          }
        }
        throw new Error(
          `Operator "${operator}" is not supported for property type "${property.type}"`
        )
      }
      case 'OnOrAfter': {
        if (field === 'created_time') {
          return {
            timestamp: 'created_time',
            created_time: {
              on_or_after: formatDate(filter.value),
            },
          }
        } else if (field === 'last_edited_time') {
          return {
            timestamp: 'last_edited_time',
            last_edited_time: {
              on_or_after: formatDate(filter.value),
            },
          }
        } else if (property.type === 'date') {
          return {
            property: field,
            date: {
              on_or_after: formatDate(filter.value),
            },
          }
        }
        throw new Error(
          `Operator "${operator}" is not supported for property type "${property.type}"`
        )
      }
      case 'Equals': {
        if (property.type === 'number') {
          return {
            property: field,
            number: {
              equals: filter.value,
            },
          }
        }
        throw new Error(
          `Operator "${operator}" is not supported for property type "${property.type}"`
        )
      }
      case 'IsAnyOf': {
        if (property.type === 'multi_select') {
          return {
            or: filter.value.map((value) => ({
              property: field,
              multi_select: {
                contains: value,
              },
            })),
          }
        }
        throw new Error(
          `Operator "${operator}" is not supported for property type "${property.type}"`
        )
      }
      case 'IsFalse': {
        if (property.type === 'checkbox') {
          return {
            property: field,
            checkbox: {
              equals: false,
            },
          }
        }
        throw new Error(
          `Operator "${operator}" is not supported for property type "${property.type}"`
        )
      }
      case 'IsTrue': {
        if (property.type === 'checkbox') {
          return {
            property: field,
            checkbox: {
              equals: true,
            },
          }
        }
        throw new Error(
          `Operator "${operator}" is not supported for property type "${property.type}"`
        )
      }
      default: {
        throw new Error(`Operator "${operator}" is not supported`)
      }
    }
  }
}

type NotionProperty =
  | {
      type: 'title'
      title: RichTextItemResponse[]
    }
  | {
      type: 'rich_text'
      rich_text: RichTextItemResponse[]
    }
  | {
      type: 'number'
      number: number | null
    }
  | {
      type: 'select'
      select: { id: string; name: string; color: string } | null
    }
  | {
      type: 'multi_select'
      multi_select: { id: string; name: string; color: string }[]
    }
  | {
      type: 'date'
      date: { start: string; end: string | null } | null
    }
  | {
      type: 'checkbox'
      checkbox: boolean
    }
  | {
      type: 'url'
      url: string | null
    }
  | {
      type: 'email'
      email: string | null
    }
  | {
      type: 'phone_number'
      phone_number: string | null
    }
  | {
      type: 'relation'
      relation: { id: string }[]
    }
  | {
      type: 'formula'
      formula:
        | { type: 'string'; string: string | null }
        | { type: 'number'; number: number | null }
        | { type: 'boolean'; boolean: boolean | null }
        | { type: 'date'; date: { start: string; end: string | null } | null }
    }
  | {
      type: 'rollup'
      rollup: {
        type: 'number' | 'date' | 'array'
        number?: number | null
        date?: { start: string; end: string | null } | null
        array?: NotionProperty[]
      }
    }
  | {
      type: 'people'
      people: (PartialUserObjectResponse | UserObjectResponse)[]
    }
  | {
      type: 'files'
      files: (
        | { name: string; file: { url: string } }
        | { name: string; external: { url: string } }
      )[]
    }
  | {
      type: 'created_time'
      created_time: string
    }
  | {
      type: 'last_edited_time'
      last_edited_time: string
    }
  | {
      type: 'created_by'
      created_by: { id: string; object: string }
    }
  | {
      type: 'last_edited_by'
      last_edited_by: { id: string; object: string }
    }
  | { type: 'status'; status: { name: string; id: string } | null }
  | { type: 'button'; button: { [key: string]: never } }
  | { type: 'unique_id'; unique_id: { prefix: string | null; number: number | null } }
  | {
      type: 'verification'
      verification: {
        state: string
        verified_by:
          | { id: string }
          | {
              id: string
              object: string
            }
          | {
              person: { email?: string | undefined }
              id: string
              type?: 'person' | undefined
              name?: string | null | undefined
              avatar_url?: string | null | undefined
              object?: 'user' | undefined
            }
          | null
        date: {
          start: string
          end: string | null
        } | null
      } | null
    }
