"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

/**
 * PasskeyModal component renders a modal dialog for admin access verification.
 * It checks if the user has the correct passkey to access the admin page.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered PasskeyModal component.
 *
 * @example
 * <PasskeyModal />
 *
 * @remarks
 * This component uses local storage to store the encrypted access key and
 * verifies it against the environment variable `NEXT_PUBLIC_ADMIN_PASSKEY`.
 *
 * @function
 * @name PasskeyModal
 *
 * @hook
 * @name useRouter
 * @description Used to navigate between routes.
 *
 * @hook
 * @name usePathname
 * @description Used to get the current pathname.
 *
 * @hook
 * @name useState
 * @description Used to manage the state of the modal, passkey, and error message.
 *
 * @hook
 * @name useEffect
 * @description Used to check the access key on component mount.
 *
 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - The mouse event triggered by clicking the validate button.
 *
 * @function
 * @name closeModal
 * @description Closes the modal and redirects to the home page.
 *
 * @function
 * @name validatePasskey
 * @description Validates the entered passkey and sets the appropriate state.
 *
 * @returns {void}
 */
export const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  // `open` starts as `false` so SSR and the first client render agree —
  // required to avoid a hydration mismatch in React 19. The post-
  // hydration `useEffect` below derives the real value once both
  // `path` and `localStorage` are readable on the client.
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  // Get the encrypted access key from local storage if available
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    // Post-hydration derive of modal-open + redirect. React 19's
    // `react-hooks/set-state-in-effect` rule flags `setOpen(...)` calls
    // inside effects, but this block is safe: the body is gated on a
    // readable `path` and reads `localStorage` lazily via the render-time
    // `encryptedKey` check, so it only ever runs on the client after
    // hydration. Each `setOpen` call uses a targeted disable comment.
    if (!path) return;

    const accessKey = encryptedKey && decryptKey(encryptedKey);
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSKEY?.toString();
    const isAccessGranted = accessKey === expected;

    if (isAccessGranted) {
      // Skip the redirect when we're already on `/admin` to avoid a
      // redundant `router.push` on every navigation.
      if (path !== "/admin") router.push("/admin");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration mount-time closure of the modal; see block comment above
      setOpen(false);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration mount-time opening of the modal; see block comment above
      setOpen(true);
    }
  }, [encryptedKey, path, router]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Validate the entered passkey and set the appropriate state based on the result
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      // Encrypt the passkey and store it in local storage
      const encryptedKey = encryptKey(passkey);

      // Store the encrypted access key in local storage
      localStorage.setItem("accessKey", encryptedKey);

      // Close the modal and redirect to the admin page
      setOpen(false);
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
