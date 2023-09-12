/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Table } from '@entities/app/table/Table'
import { Record } from './index'
import { SingleLineTextField } from '@entities/app/table/field/singleLineText/SingleLineTextField'

const record = new Record({ name: 'test' }, new Table('table', [new SingleLineTextField('name')]))

record.softDelete()

record.setFieldValue('name', 'test')

// ce que t'as fait: strategy pattern, ca a du sens quand toutes tes implems doivent implem toutes les mes methodes
// con: on veut pas permettre l'edition d'un deletedrecord => on ne sera averti qu'en runtime...

// alternative: vrai polymorphisme

class DeletedRecord {
  getTime() {
    /*...*/
  }
}

const deletedRecord = new DeletedRecord()
deletedRecord.setFieldValue('name', 'test') // "property does not exist" => on est prévenus

class UpdatedRecord {
  softDelete() {
    return new DeletedRecord()
  }
}
const updateRecord = new UpdateRecord()
updateRecord.softDelete() // => returns instance of DeletedRecord

// OU ALORS

// Tester une implémentation des assertions function en typescript pour lui dire de renvoyer un warning quand la fonction renvoie une erreur :
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg)
  }
}
function isString(val: any): val is string {
  return typeof val === 'string'
}
function yell(str: any) {
  if (isString(str)) {
    return str.toUppercase()
  }
  throw 'Oops!'
}
