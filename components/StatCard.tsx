import clsx from "clsx";
import Image from "next/image";

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
};

/**
 * A component that displays a statistic card with an icon, count, and label.
 *
 * @param {StatCardProps} props - The properties for the StatCard component.
 * @param {number} [props.count=0] - The count to display on the card.
 * @param {string} props.label - The label to display below the count.
 * @param {string} props.icon - The URL of the icon to display next to the count.
 * @param {string} props.type - The type of the statistic, which determines the background color of the card.
 *
 * @returns {JSX.Element} The rendered StatCard component.
 */
export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};
