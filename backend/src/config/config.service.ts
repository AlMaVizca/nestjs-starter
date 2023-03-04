import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { Config } from './config.const';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: { [key: string]: string };
  constructor(filePath: string) {
    dotenv.config({
      path: filePath,
    });

    this.envConfig = this.validateInput(process.env);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
  validateInput(envConfig: EnvConfig): EnvConfig {
    const schema = {};
    schema[Config.LOAD_SWAGGER_UI] = Joi.boolean().default(true);
    schema[Config.TITLE] = Joi.string().default('Initial app');

    const envVarsSchema: Joi.ObjectSchema = Joi.object(schema);
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        allowUnknown: true,
      },
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
