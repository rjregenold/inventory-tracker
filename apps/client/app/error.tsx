'use client';

import {IconRefresh} from '@/components/icons';

interface ErrorProps {
  error: Error & {digest?: string};
  reset: () => void;
}

export default function Error({error, reset}: ErrorProps) {
  return (
    <>
      <div>
        <strong>An error occurred:</strong> {error.message}
      </div>
      <button onClick={reset} className="flex align-center btn">
        <IconRefresh />
        Try again
      </button>
    </>
  );
}
