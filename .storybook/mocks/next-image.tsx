import type { CSSProperties, ImgHTMLAttributes } from 'react';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src: string | { src: string; height: number; width: number };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  unoptimized?: boolean;
  sizes?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

function Image({
  src,
  alt,
  width,
  height,
  fill,
  style,
  className,
  onLoad,
  onError,
  ...rest
}: ImageProps) {
  const imgSrc = typeof src === 'string' ? src : src.src;

  const imgStyle: CSSProperties = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover',
        ...style,
      }
    : style || {};

  return (
    // biome-ignore lint/performance/noImgElement: Mock component for Storybook - must use native img
    <img
      src={imgSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      style={imgStyle}
      className={className}
      onLoad={onLoad}
      onError={onError}
      {...rest}
    />
  );
}

export default Image;
