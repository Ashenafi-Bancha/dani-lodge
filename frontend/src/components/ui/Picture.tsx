import type { ImgHTMLAttributes } from 'react';
import type { Photo } from '@/lib/photos';

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> {
  photo: Photo;
  /** Tells the browser how wide the image renders so phones fetch the small file. */
  sizes: string;
  priority?: boolean;
}

export default function Picture({ photo, sizes, priority = false, ...rest }: PictureProps) {
  // React 18 only passes this attribute through when it is spelled lowercase
  const priorityAttrs: Record<string, string> = priority ? { fetchpriority: 'high' } : {};
  return (
    <img
      src={`/images/${photo.id}-1440.webp`}
      srcSet={`/images/${photo.id}-768.webp 768w, /images/${photo.id}-1440.webp 1440w`}
      sizes={sizes}
      alt={photo.alt}
      width={1440}
      height={1080}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...priorityAttrs}
      {...rest}
    />
  );
}
