import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";
import { year } from "@/constants";

// Skip SSG: this page calls Appwrite via `getUser()`/`getPatient()`.
// Same rationale as /admin: pre-rendering at build time fails when the
// Appwrite project is paused or env vars are unset in CI.
export const dynamic = "force-dynamic";

/**
 * The Register component is an asynchronous function that handles the registration process for a patient.
 * It fetches the user and patient data based on the provided userId parameter.
 * If the patient already exists, it redirects to the new appointment page.
 * Otherwise, it displays the registration form for the user.
 *
 * @param {SearchParamProps} params - The search parameters containing the userId.
 * @returns {JSX.Element} The JSX element representing the registration page.
 */
const Register = async ({ params }: SearchParamProps) => {
  // get the userId from the search parameters
  const { userId } = await params;
  // fetch the user and patient data based on the userId
  const user = await getUser(userId);
  // fetch the patient data based on the userId
  const patient = await getPatient(userId);

  // if the patient already exists, redirect to the new appointment page
  if (patient) redirect(`/patients/${userId}/new-appointment`);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          {/* Register Form */}
          <RegisterForm user={user} />

          <p className="copyright py-12">© {year} CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
