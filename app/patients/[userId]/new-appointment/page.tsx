import Image from "next/image";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import { year } from "@/constants";

/**
 * Appointment component for creating a new appointment for a patient.
 *
 * @param {SearchParamProps} params - The search parameters containing the userId.
 * @returns {JSX.Element} The JSX element representing the appointment creation page.
 *
 * @async
 * @function
 */
const Appointment = async ({ params }: SearchParamProps) => {
  // get the userId from the search parameters
  const { userId } = await params;
  // get the patient's information based on the userId
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© {year} CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
