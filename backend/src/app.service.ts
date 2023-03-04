import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getVersion(): Record<string, any> {
    const version = process.env.npm_package_version;
    return {
      version,
    };
  }
}
