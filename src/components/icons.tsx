import type * as React from 'react';

export const AniMovieLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src="/logo.png"
    alt="AniMovie Logo"
    {...props}
    className='h-12 w-auto'
  />
);