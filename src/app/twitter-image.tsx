import {
  SHARE_OG_ALT,
  SHARE_OG_CONTENT_TYPE,
  SHARE_OG_SIZE,
  shareOpenGraphImageResponse,
} from "@/lib/shareOgImage";

export const alt = SHARE_OG_ALT;
export const size = SHARE_OG_SIZE;
export const contentType = SHARE_OG_CONTENT_TYPE;

export default async function Image() {
  return shareOpenGraphImageResponse();
}
