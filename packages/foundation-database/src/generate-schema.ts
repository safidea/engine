import fs from 'fs-extra';
import util from 'util'
import { exec } from 'child_process';

import { DatabaseConfig } from '../types/database.type'

const execPromise = util.promisify(exec);

export default async function generateSchema(config: DatabaseConfig) {
  let schema = `generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "${config.provider}"
    url      = "${config.url}"
  }\n`; 

  const jsonData = config.tables
  schema += Object.keys(jsonData)
    .map((modelName) => {
      const modelData = jsonData[modelName];
      const fields = Object.keys(modelData).map((fieldName) => {
        const fieldData = modelData[fieldName];
        let fieldType = '';
        let defaultValue = '';
        switch (fieldData.type) {
          case 'integer':
            fieldType = 'Int';
            defaultValue = fieldData.primary ? ' @default(autoincrement())' : ' @default(0)';
            break;
          case 'string':
            fieldType = 'String';
            defaultValue = ' @default("")';
            break;
          case 'datetime':
            fieldType = 'DateTime';
            defaultValue = ' @default(now())';
            break;
          default:
            fieldType = fieldData.type;
            break;
        }
        const isPrimary = fieldData.primary ? ' @id' : '';
        const isRequired = !fieldData.nullable ? ` ${defaultValue}` : '';
        return `${fieldName} ${fieldType}${isPrimary}${isRequired}`;
      });
      return `model ${modelName} {
        ${fields.join('\n  ')}
      }`;
    })
    .join('\n');

  fs.writeFileSync('./prisma/schema.prisma', schema);

  try {
    await execPromise('npx prisma format')
    const { stderr } = await execPromise('npx prisma generate');
    if (stderr) console.log(stderr);
  } catch (error) {
    console.error(error);
  }
}