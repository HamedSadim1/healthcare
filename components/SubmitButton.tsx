import Image from "next/image";

import { Button } from "./ui/button";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * SubmitButton component renders a button that can show a loading state.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isLoading - Indicates whether the button is in a loading state.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {React.ReactNode} props.children - The content to display inside the button when not loading.
 *
 * @returns {JSX.Element} The rendered button component.
 */
const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
