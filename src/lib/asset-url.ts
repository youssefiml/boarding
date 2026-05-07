import type { StaticImageData } from 'next/image';

type AssetSource = string | StaticImageData;

export function assetUrl(asset: AssetSource) {
  return typeof asset === 'string' ? asset : asset.src;
}
