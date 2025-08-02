import Image from "next/image";
import Link from "next/link";

import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import { year } from "@/constants";

/**
 * The Home component is an asynchronous function that renders the main page of the healthcare application.
 * It conditionally displays a PasskeyModal if the `admin` search parameter is set to "true".
 *
 * @param {SearchParamProps} props - The properties object containing search parameters.
 * @param {object} props.searchParams - The search parameters passed to the component.
 * @param {string} [props.searchParams.admin] - The admin search parameter to determine if the user is an admin.
 *
 * @returns {JSX.Element} The JSX code for the Home component.
 */
const Home = async ({ searchParams }: SearchParamProps) => {
  const resolvedSearchParams = await searchParams;
  const isAdmin = resolvedSearchParams?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © {year} CarePluse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;
