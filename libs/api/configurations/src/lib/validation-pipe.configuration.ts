import { ConfigType, registerAs } from '@nestjs/config';

export const defaultDisableErrorMessages = false;

export const validationPipeConfiguration = registerAs('validation-pipe', () => {
  return {
    disableErrorMessages:
      Boolean(process.env['DISABLE_ERROR_MESSAGES']) ||
      defaultDisableErrorMessages,
  };
});

export type ValidationPipeConfiguration = ConfigType<
  typeof validationPipeConfiguration
>;
