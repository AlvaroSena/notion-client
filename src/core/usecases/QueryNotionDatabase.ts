import { prisma } from '../../infra/prisma'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { Client } from '@notionhq/client'

interface QueryNotionDatabaseRequest {
  publicKey: string
  query?: {
    property: string
    checkbox: {
      equals: boolean
    }
  }
}

export class QueryNotionDatabase {
  async execute({ publicKey, query }: QueryNotionDatabaseRequest) {
    const publicKeyExists = await prisma.publicKey.findUnique({
      where: {
        value: publicKey,
      },
      include: {
        secretKey: true,
      },
    })

    if (!publicKeyExists) {
      throw new ResourceNotFoundError()
    }

    const secretKeyValue = publicKeyExists.secretKey?.value
    const notion = new Client({ auth: secretKeyValue })
    const notionDatabaseId = publicKeyExists.secretKey?.notionDatabaseId

    if (!notionDatabaseId) {
      throw new ResourceNotFoundError()
    }

    const response = await notion.databases.query({
      database_id: notionDatabaseId,
      filter: query,
    })

    return response
  }
}
