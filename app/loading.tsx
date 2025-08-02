import Image from "next/image";

/**
 * A React functional component that displays a loading spinner.
 *
 * @component
 * @example
 * return (
 *   <Loading />
 * )
 *
 * @returns {JSX.Element} A div containing a spinning loader image and a "Loading..." text.
 */
export default function Loading() {
  return (
    <div className="flex-center size-full h-screen gap-3 text-white">
      <Image
        src="/assets/icons/loader.svg"
        alt="loader"
        width={40}
        height={3240}
        className="animate-spin"
      />
      Loading...
    </div>
  );
}
