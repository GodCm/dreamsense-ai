import { createCreem } from 'creem_io';

const isTestMode = process.env.CREEM_TEST_MODE === 'true';

export const creemClient = createCreem({
  apiKey: process.env.CREEM_API_KEY || 'creem_5GjMeIkjlxCjXuDWu7WMvs',
  environment: isTestMode ? 'test' : 'production',
});






