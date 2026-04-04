import { CreemClient } from '@creem_io/nextjs';

const creem = new CreemClient({
  apiKey: process.env.CREEM_API_KEY || 'creem_5GjMeIkjlxCjXuDWu7WMvs',
});

export { creem };


