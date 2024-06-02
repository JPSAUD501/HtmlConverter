import { HttpException, Injectable, StreamableFile } from '@nestjs/common'
import packageJson from '../package.json'
import { apiReference } from '@scalar/nestjs-api-reference'
import { Request, Response } from 'express'
import { OpenAPIObject } from '@nestjs/swagger'
import { ConvertHtmlToPngRequestDto, GetVersionResponseDto } from './app.dto'
import { config } from './config'
import nodeHtmlToImage from 'node-html-to-image'

@Injectable()
export class AppService {
  getHealth (): string {
    return 'OK'
  }

  getVersion (): GetVersionResponseDto {
    return {
      version: packageJson.version
    }
  }

  getOpenApiJson (): OpenAPIObject {
    if (config.openapiObject === undefined) {
      throw new HttpException('OpenAPIObject is not defined', 500)
    }
    return config.openapiObject
  }

  getScalarInterface (req: Request, res: Response): void {
    const openapiDocument = this.getOpenApiJson()
    const api = apiReference({
      spec: { content: openapiDocument },
      hideModels: true
    })
    api(req, res)
  }

  async convertHtmlToPng (convertHtmlToPngRequestDto: ConvertHtmlToPngRequestDto): Promise<StreamableFile> {
    const image = await nodeHtmlToImage({
      html: convertHtmlToPngRequestDto.html,
      puppeteerArgs: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    })
    if (!Buffer.isBuffer(image)) {
      throw new HttpException('Failed to convert HTML to PNG', 500)
    }
    return new StreamableFile(image)
  }
}
