import {Fragment, ReactNode} from 'react';

interface Props {
  items: Array<{term: string; value: ReactNode}>;
}

export default function DescriptionList({items}: Props) {
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
      {items.map(({term, value}, index) => (
        <Fragment key={index}>
          <dt className="text-sm font-medium whitespace-nowrap">{term}:</dt>
          <dd className="text-sm">{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
