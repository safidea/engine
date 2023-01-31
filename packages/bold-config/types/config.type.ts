import type { App } from './app.config.type'
import type { Page } from 'bold-page'
import type { Api } from 'bold-api'
import type { Table } from 'bold-table'
import type { Theme } from 'bold-theme'
import type { Locale } from 'bold-locale'
import type { Component } from 'bold-component'

export type Config = App & {
  pages?: Page[]
  apis?: Api[]
  tables?: Table[]
  theme?: Theme
  locales?: Locale[]
  components?: Component[]
}

export type { App, Page, Api, Table, Theme, Locale, Component }
