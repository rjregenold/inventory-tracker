interface Props {
  message: string;
}

export default function PageLoading({message}: Props) {
  return (
    <div className="flex items-center">
      <span className="loading loading-spinner loading-md"></span>
      <span className="ml-2">{message}</span>
    </div>
  );
}
