import React from 'react';

/**
 * Container component to insert the content page
 * @param param0 children/content page
 * @returns
 */
export default function Container({ children }: any) {
  return <div className="container">{children}</div>;
}
