import { Models } from "node-appwrite";

/**
 * Represents a patient in the healthcare system.
 *
 * @interface Patient
 * @extends {Models.Document}
 *
 * @property {string} userId - The unique identifier for the user.
 * @property {string} name - The name of the patient.
 * @property {string} email - The email address of the patient.
 * @property {string} phone - The phone number of the patient.
 * @property {Date} birthDate - The birth date of the patient.
 * @property {Gender} gender - The gender of the patient.
 * @property {string} address - The address of the patient.
 * @property {string} occupation - The occupation of the patient.
 * @property {string} emergencyContactName - The name of the emergency contact person.
 * @property {string} emergencyContactNumber - The phone number of the emergency contact person.
 * @property {string} primaryPhysician - The primary physician of the patient.
 * @property {string} insuranceProvider - The insurance provider of the patient.
 * @property {string} insurancePolicyNumber - The insurance policy number of the patient.
 * @property {string | undefined} allergies - The allergies of the patient, if any.
 * @property {string | undefined} currentMedication - The current medication of the patient, if any.
 * @property {string | undefined} familyMedicalHistory - The family medical history of the patient, if any.
 * @property {string | undefined} pastMedicalHistory - The past medical history of the patient, if any.
 * @property {string | undefined} identificationType - The type of identification document, if any.
 * @property {string | undefined} identificationNumber - The identification number, if any.
 * @property {FormData | undefined} identificationDocument - The identification document, if any.
 * @property {boolean} privacyConsent - Indicates whether the patient has given privacy consent.
 */
export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}
