'use client';

interface MirhaPretLogoProps {
  /** Constrain by height (px). Width scales automatically. Use this for navbars/sidebars. */
  height?: number;
  /** Constrain by width (px). Height scales automatically. Use this for loading screens etc. */
  width?: number;
  /** 'black' (default) | 'white' | 'gold' */
  color?: 'black' | 'white' | 'gold';
  className?: string;
  style?: React.CSSProperties;
}

const FILTERS: Record<string, string> = {
  black: 'none',
  white: 'invert(1)',
  gold: 'invert(0.15) sepia(1) saturate(2.5) hue-rotate(5deg) brightness(1.05)',
};

/**
 * MirhaPret SVG Logo — uses the real vector logo file.
 * For dark backgrounds pass color="white"; for gold accents pass color="gold".
 */
export function MirhaPretLogo({
  height,
  width,
  color = 'black',
  className,
  style,
}: MirhaPretLogoProps) {
  const imgStyle: React.CSSProperties = {
    display: 'block',
    filter: FILTERS[color] ?? 'none',
    ...(height ? { height: `${height}px`, width: 'auto' } : {}),
    ...(width && !height ? { width: `${width}px`, height: 'auto' } : {}),
    ...style,
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-icon.svg"
      alt="MirhaPret"
      style={imgStyle}
      className={className}
    />
  );
}
