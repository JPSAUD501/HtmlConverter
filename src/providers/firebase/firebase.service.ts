import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { initializeApp, cert, App, ServiceAccount } from 'firebase-admin/app'
import { Storage, getStorage } from 'firebase-admin/storage'

@Injectable()
export class FirebaseService {
  private readonly client: App

  constructor (private readonly configService: ConfigService) {
    const serviceAccountBase64 = this.configService.get<string>('SERVICE_ACCOUNT_BASE64')
    if (serviceAccountBase64 === undefined) {
      throw new Error('SERVICE_ACCOUNT_BASE64 is not defined')
    }
    this.client = initializeApp({
      credential: cert(JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString()) as ServiceAccount),
      storageBucket: 'project-paroli-dev.appspot.com'
    })
  }

  getClient (): App {
    return this.client
  }

  getStorage (): Storage {
    return getStorage(this.client)
  }
}
