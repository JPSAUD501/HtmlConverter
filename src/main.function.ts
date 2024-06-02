import { core } from './main.core'
import express from 'express'
import * as functions from 'firebase-functions'
import { Express } from 'express-serve-static-core'
import { config } from './config'
import { Logger } from '@nestjs/common'
import dotenv from 'dotenv'
import { SwaggerModule } from '@nestjs/swagger'
import metadata from './metadata'
dotenv.config()

const server = express()

const createNestServer = async (expressInstance: Express): Promise<void> => {
  const serverBasePath = process.env.SERVER_BASE_PATH
  const coreResponse = await core({
    expressInstance,
    serverBasePath
  })
  await SwaggerModule.loadPluginMetadata(metadata as () => Promise<Record<string, any>>)
  config.openapiObject = SwaggerModule.createDocument(coreResponse.app, coreResponse.partialOpenapiObject)
  await coreResponse.app.init()
}

Logger.log('Nest server starting...')
createNestServer(server)
  .then(() => { Logger.log('Nest server ready!') })
  .catch((err) => { Logger.error('Nest server broken!', err) })

export const api = functions.runWith({
  secrets: ['TELEGRAM_BOT_TOKEN', 'ELEVENLABS_API_KEY', 'OPENAI_API_KEY', 'SERVICE_ACCOUNT_BASE64', 'DATABASE_SSL', 'DATABASE_URL', 'GEMINI_API_KEY']
}).https.onRequest(server)
