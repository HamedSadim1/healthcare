import clsx from "clsx";
import Image from "next/image";

import { StatusIcon } from "@/constants";

/**
 * A component that displays a status badge with an icon and text.
 *
 * @param {Object} props - The component props.
 * @param {Status} props.status - The status to display. Can be "scheduled", "pending", or "cancelled".
 *
 * @returns {JSX.Element} The rendered status badge component.
 */
export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-blue-600": status === "pending",
        "bg-red-600": status === "cancelled",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending",
          "text-red-500": status === "cancelled",
        })}
      >
        {status}
      </p>
    </div>
  );
};
