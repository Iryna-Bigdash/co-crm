import { RateLimiter } from 'limiter';

export const limiter = new RateLimiter({
  tokensPerInterval: 15,
  interval: 'second',
  fireImmediately: true
});
