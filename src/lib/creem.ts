import { createCreem } from 'creem_io';

export const creemClient = createCreem({
  apiKey: process.env.CREEM_API_KEY || 'creem_5GjMeIkjlxCjXuDWu7WMvs',
  testMode: process.env.CREEM_TEST_MODE === 'true',
});






