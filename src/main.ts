import { apiReference } from '@scalar/nestjs-api-reference'
import { SwaggerModule } from '@nestjs/swagger'
import { core } from './main.core'
import { config } from './config'
import metadata from './metadata'

async function bootstrap (): Promise<void> {
  const globalPrefix = '/api'
  const coreResponse = await core({
    globalPrefix
  })
  coreResponse.app.setGlobalPrefix(globalPrefix)
  await SwaggerModule.loadPluginMetadata(metadata as () => Promise<Record<string, any>>)
  const openapiDocument = SwaggerModule.createDocument(coreResponse.app, coreResponse.partialOpenapiObject)
  SwaggerModule.setup('/swagger', coreResponse.app, openapiDocument, {
    useGlobalPrefix: true,
    jsonDocumentUrl: '/openapi.json',
    yamlDocumentUrl: '/openapi.yaml'
  })
  coreResponse.app.use(
    `${globalPrefix}/openapi.json`,
    apiReference({
      spec: {
        content: openapiDocument
      }
    })
  )
  config.openapiObject = openapiDocument
  await coreResponse.app.listen(5000)
}
void bootstrap()
