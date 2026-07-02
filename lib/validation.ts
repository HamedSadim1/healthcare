import { z } from "zod";

/**
 * Schema for validating user form input using Zod.
 *
 * This schema validates the following fields:
 * - `name`: A string that must be between 2 and 50 characters.
 * - `email`: A string that must be a valid email address.
 * - `phone`: A string that must be a valid phone number in the format `+` followed by 10 to 15 digits.
 *
 * @constant
 * @type {ZodObject}
 */
export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

/**
 * Schema for validating patient form data using Zod.
 *
 * This schema includes the following fields:
 *
 * - `name`: A string representing the patient's name. Must be between 2 and 50 characters.
 * - `email`: A string representing the patient's email address. Must be a valid email format.
 * - `phone`: A string representing the patient's phone number. Must be in the format of + followed by 10 to 15 digits.
 * - `birthDate`: A date representing the patient's birth date.
 * - `gender`: An enum representing the patient's gender. Can be "Male", "Female", or "Other".
 * - `address`: A string representing the patient's address. Must be between 5 and 500 characters.
 * - `occupation`: A string representing the patient's occupation. Must be between 2 and 500 characters.
 * - `emergencyContactName`: A string representing the name of the patient's emergency contact. Must be between 2 and 50 characters.
 * - `emergencyContactNumber`: A string representing the phone number of the patient's emergency contact. Must be in the format of + followed by 10 to 15 digits.
 * - `primaryPhysician`: A string representing the patient's primary physician. Must be at least 2 characters.
 * - `insuranceProvider`: A string representing the patient's insurance provider. Must be between 2 and 50 characters.
 * - `insurancePolicyNumber`: A string representing the patient's insurance policy number. Must be between 2 and 50 characters.
 * - `allergies`: An optional string representing the patient's allergies.
 * - `currentMedication`: An optional string representing the patient's current medication.
 * - `familyMedicalHistory`: An optional string representing the patient's family medical history.
 * - `pastMedicalHistory`: An optional string representing the patient's past medical history.
 * - `identificationType`: An optional string representing the type of identification provided by the patient.
 * - `identificationNumber`: An optional string representing the identification number provided by the patient.
 * - `identificationDocument`: An optional custom type representing the identification document provided by the patient.
 * - `treatmentConsent`: A boolean indicating whether the patient consents to treatment. Must be true to proceed.
 * - `disclosureConsent`: A boolean indicating whether the patient consents to disclosure. Must be true to proceed.
 * - `privacyConsent`: A boolean indicating whether the patient consents to privacy. Must be true to proceed.
 */
export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.array(z.instanceof(File)).optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

/**
 * Schema for creating an appointment.
 *
 * @constant
 * @type {ZodObject}
 *
 * @property {ZodString} primaryPhysician - The primary physician's name. Must be at least 2 characters long.
 * @property {ZodDate} schedule - The date and time of the appointment.
 * @property {ZodString} reason - The reason for the appointment. Must be between 2 and 500 characters.
 * @property {ZodOptional<ZodString>} note - An optional note for the appointment.
 * @property {ZodOptional<ZodString>} cancellationReason - An optional reason for cancellation.
 */
export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

/**
 * Schema for validating the schedule appointment data.
 *
 * - `primaryPhysician`: A string representing the primary physician's name. Must be at least 2 characters long.
 * - `schedule`: A date object representing the scheduled appointment date.
 * - `reason`: An optional string representing the reason for the appointment.
 * - `note`: An optional string for any additional notes.
 * - `cancellationReason`: An optional string for the reason if the appointment is cancelled.
 */
export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

/**
 * Schema for validating the cancellation of an appointment.
 *
 * - `primaryPhysician`: A string representing the primary physician's name. Must be at least 2 characters long.
 * - `schedule`: A date object representing the scheduled date of the appointment.
 * - `reason`: An optional string representing the reason for the appointment.
 * - `note`: An optional string for additional notes.
 * - `cancellationReason`: A string representing the reason for cancellation. Must be between 2 and 500 characters long.
 */
export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

/**
 * Returns the appropriate appointment schema based on the provided type.
 *
 * @param type - The type of appointment schema to retrieve.
 *               It can be one of the following values:
 *               - "create": Returns the schema for creating an appointment.
 *               - "cancel": Returns the schema for canceling an appointment.
 *               - Any other value: Returns the schema for scheduling an appointment.
 * @returns The corresponding appointment schema.
 */
export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
