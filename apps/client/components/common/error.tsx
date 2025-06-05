export interface Props {
  message: string;
}

export default function Error(props: Props) {
  return (
    <>
      <div>
        <strong>Error:</strong> {props.message}
      </div>
      <div>Please try again later.</div>
    </>
  );
}
