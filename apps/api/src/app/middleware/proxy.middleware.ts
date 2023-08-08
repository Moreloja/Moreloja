import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import {
  InjectPictrsConfig,
  PictrsConfiguration,
} from '@moreloja/api/configurations';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly imageProxy = createProxyMiddleware({
    target: this.pictrsConfiguration.domain,
    changeOrigin: true,
    pathRewrite: {
      '^/api/image/original': '/image/original',
    },
  });

  constructor(
    @InjectPictrsConfig()
    private readonly pictrsConfiguration: PictrsConfiguration
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.imageProxy(req, res, next);
  }
}
