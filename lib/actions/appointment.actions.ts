"use server";

import { revalidatePath } from "next/cache";
import { ID, Query, type Models } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

/**
 * Aggregate shape returned by `getRecentAppointmentList`. Defined locally so
 * that the action's return type is fully typed (Promise<AppointmentCounts | undefined>)
 * instead of an implicit Promise<unknown> — consistent with the other actions
 * in this file now that the no-`any` strictness applies here too.
 *
 * Exported so the `app/admin/page.tsx` Server Component can use it as the
 * shape of its `?? { ... }` fallback when Appwrite is unreachable.
 */
export interface AppointmentCounts {
  totalCount: number;
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: Appointment[];
}

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";

//  CREATE APPOINTMENT
/**
 * Creates a new appointment in the database.
 *
 * @param {CreateAppointmentParams} appointment - The parameters for the new appointment.
 * @returns {Promise<Appointment | undefined>} The newly created appointment object.
 * @throws Will throw an error if the appointment creation fails.
 */
export const createAppointment = async (
  appointment: CreateAppointmentParams
): Promise<Appointment | undefined> => {
  try {
    // Create a new appointment document in the database
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    // revalidate the admin page to reflect the new appointment
    revalidatePath("/admin");
    // return the parsed and stringified new appointment
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

//  GET RECENT APPOINTMENTS
/**
 * Retrieves the list of recent appointments from the database, ordered by creation date in descending order.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to a JSON string containing the total count of appointments,
 *                                        counts of scheduled, pending, and cancelled appointments, and the list of appointment documents.
 *                                        Returns `undefined` if an error occurs.
 *
 * @throws Will log an error message to the console if an error occurs while retrieving the appointments.
 */
export const getRecentAppointmentList = async (): Promise<
  AppointmentCounts | undefined
> => {
  try {
    // Retrieve the list of appointments from the database, ordered by creation date in descending order
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    // const scheduledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "scheduled");

    // const pendingAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "pending");

    // const cancelledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "cancelled");

    // const data = {
    //   totalCount: appointments.total,
    //   scheduledCount: scheduledAppointments.length,
    //   pendingCount: pendingAppointments.length,
    //   cancelledCount: cancelledAppointments.length,
    //   documents: appointments.documents,
    // };

    // initial counts
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // reduce appointments to counts of scheduled, pending, and cancelled appointments and return the total count and the list of appointment documents
    const counts = (appointments.documents as unknown as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    // data to return to the client (total count, counts of scheduled, pending, and cancelled appointments, and the list of appointment documents)
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    // return the parsed and stringified data
    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

//  SEND SMS NOTIFICATION
export const sendSMSNotification = async (
  userId: string,
  content: string
): Promise<Models.Message | undefined> => {
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};

//  UPDATE APPOINTMENT
/**
 * Updates an appointment with the given parameters and sends an SMS notification to the user.
 *
 * @param {UpdateAppointmentParams} params - The parameters for updating the appointment.
 * @param {string} params.appointmentId - The ID of the appointment to update.
 * @param {string} params.userId - The ID of the user associated with the appointment.
 * @param {string} params.timeZone - The time zone of the appointment.
 * @param {object} params.appointment - The appointment details to update.
 * @param {string} params.type - The type of update (e.g., "schedule" or "cancel").
 *
 * @returns {Promise<Appointment | undefined>} The updated appointment details.
 *
 * @throws Will throw an error if the appointment update fails.
 */
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams): Promise<Appointment | undefined> => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    // If the update fails, throw an error
    if (!updatedAppointment) throw new Error("Appointment update failed");

    // Send SMS notification to the user based on the appointment type  (schedule/cancel) and the appointment details (schedule/cancellation reason)
    const smsMessage = `Greetings from CarePulse. ${
      type === "schedule"
        ? `Your appointment is confirmed for ${
            formatDateTime(appointment.schedule!, timeZone).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment for ${
            formatDateTime(appointment.schedule!, timeZone).dateTime
          } is cancelled. Reason:  ${appointment.cancellationReason}`
    }.`;
    // Send SMS notification to the user
    await sendSMSNotification(userId, smsMessage);

    // Revalidate the admin page to reflect the updated appointment
    revalidatePath("/admin");
    // Return the updated appointment details
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

// GET APPOINTMENT
/**
 * Retrieves an appointment document from the database by its ID.
 *
 * @param {string} appointmentId - The ID of the appointment to retrieve.
 * @returns {Promise<Appointment | undefined>} The appointment document, parsed and stringified.
 * @throws Will log an error message if the retrieval fails.
 */
export const getAppointment = async (
  appointmentId: string
): Promise<Appointment | undefined> => {
  try {
    // Retrieve appointment from the database by its ID
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    // return the parsed and stringified appointment document
    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};
