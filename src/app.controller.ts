import { Body, Controller, Get, Post, Redirect, Req, Res, VERSION_NEUTRAL, Version } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiExcludeEndpoint, OpenAPIObject } from '@nestjs/swagger'
import { ConvertHtmlToPngRequestDto, ConvertHtmlToPngResponseDto, GetVersionResponseDto } from './app.dto'
import { Request, Response } from 'express'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get('health')
  @Version([VERSION_NEUTRAL])
  getHealth (): string {
    return this.appService.getHealth()
  }

  @Get('version')
  @Version([VERSION_NEUTRAL])
  getVersion (): GetVersionResponseDto {
    return this.appService.getVersion()
  }

  @Get('scalar')
  @ApiExcludeEndpoint()
  @Version(VERSION_NEUTRAL)
  getScalar (@Req() req: Request, @Res() res: Response): void {
    this.appService.getScalarInterface(req, res)
  }

  @Get('openapi.json')
  @Version(VERSION_NEUTRAL)
  getOpenApiJson (): OpenAPIObject {
    return this.appService.getOpenApiJson()
  }

  @Get('openapi')
  @ApiExcludeEndpoint()
  @Version(VERSION_NEUTRAL)
  @Redirect('scalar', 302)
  getOpenApiDefaultInterface (): void {}

  @Get([''])
  @ApiExcludeEndpoint()
  @Version(VERSION_NEUTRAL)
  @Redirect('api/openapi', 302)
  getOpenApiInterface (): void {}

  @Get('api/openapi')
  @ApiExcludeEndpoint()
  @Version(VERSION_NEUTRAL)
  @Redirect('../openapi', 302)
  getFixOpenApiInterfaceRedirection (): void {}

  @Post('convert/html/to/png')
  @Version('1')
  async convertHtmlToPng (@Body() convertHtmlToPngRequestDto: ConvertHtmlToPngRequestDto): Promise<ConvertHtmlToPngResponseDto> {
    return await this.appService.convertHtmlToPng(convertHtmlToPngRequestDto)
  }
}
