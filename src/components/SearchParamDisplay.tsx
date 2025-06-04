'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchParamDisplay() {
  // useSearchParams is already used inside a client component,
  // and the parent component will wrap this in Suspense
  const searchParams = useSearchParams();
  const query = searchParams?.get('q');

  if (!query) return null;
  return <p className="text-sm text-muted-foreground">You searched for: {query}</p>;
}
