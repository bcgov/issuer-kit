
import base64url from 'base64url'
export function encodeBase64(str: string) {
  if (!str) return;
  return base64url(str)
}