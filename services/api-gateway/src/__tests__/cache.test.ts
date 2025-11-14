import { describe, test, expect } from 'vitest';
import {
  isPublicEndpoint,
  isPrivateEndpoint,
  setPublicCacheHeaders,
  setPrivateCacheHeaders,
} from '../utils/cache';

describe('Cache Utils', () => {
  describe('isPublicEndpoint', () => {
    test('should identify public endpoints', () => {
      expect(isPublicEndpoint('/v1/api/content/countries')).toBe(true);
      expect(isPublicEndpoint('/v1/api/content/cities')).toBe(true);
      expect(isPublicEndpoint('/v1/api/content/places')).toBe(true);
    });

    test('should not identify private endpoints as public', () => {
      expect(isPublicEndpoint('/v1/api/token/balance')).toBe(false);
      expect(isPublicEndpoint('/v1/api/auth/profile')).toBe(false);
    });
  });

  describe('isPrivateEndpoint', () => {
    test('should identify private endpoints', () => {
      expect(isPrivateEndpoint('/v1/api/token/balance')).toBe(true);
      expect(isPrivateEndpoint('/v1/api/referral/stats')).toBe(true);
      expect(isPrivateEndpoint('/v1/api/auth/profile')).toBe(true);
    });

    test('should not identify public endpoints as private', () => {
      expect(isPrivateEndpoint('/v1/api/content/countries')).toBe(false);
    });
  });

  describe('setPublicCacheHeaders', () => {
    test('should set correct cache headers', () => {
      const response = new Response();
      setPublicCacheHeaders(response, '/v1/api/content/countries');

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('s-maxage=600');
      expect(cacheControl).toContain('stale-while-revalidate');

      const vary = response.headers.get('Vary');
      expect(vary).toContain('Accept');
    });
  });

  describe('setPrivateCacheHeaders', () => {
    test('should set no-store headers', () => {
      const response = new Response();
      setPrivateCacheHeaders(response);

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toContain('no-store');
      expect(cacheControl).toContain('no-cache');
      expect(cacheControl).toContain('must-revalidate');

      expect(response.headers.get('Pragma')).toBe('no-cache');
      expect(response.headers.get('Expires')).toBe('0');
    });
  });
});

