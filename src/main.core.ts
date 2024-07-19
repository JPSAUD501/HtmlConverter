import { AbstractHttpAdapter, NestFactory } from '@nestjs/core'
import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe, INestApplication, VersioningType, VERSION_NEUTRAL } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'

export async function core (props: {
  globalPrefix?: string
  serverBasePath?: string
  expressInstance?: any
}): Promise<{
    app: INestApplication<any>
    partialOpenapiObject: Omit<OpenAPIObject, 'paths'>
  }> {
  const expressAdapter: AbstractHttpAdapter<any, any, any> | undefined = props.expressInstance !== undefined ? new ExpressAdapter(props.expressInstance) : undefined
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressAdapter)
  )
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL
  })
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }))
  app.enableShutdownHooks()
  if (props.globalPrefix !== undefined) {
    app.setGlobalPrefix(props.globalPrefix)
  }
  const partialDocument = new DocumentBuilder()
    .setTitle('HtmlConverter - API')
    .setDescription('The HtmlConverter API description')
    .addBearerAuth()
    .setVersion('1.0')
  if (props.serverBasePath !== undefined) {
    partialDocument.addServer(props.serverBasePath)
  }
  const partialOpenapiObject = partialDocument.build()
  return {
    app,
    partialOpenapiObject
  }
}
