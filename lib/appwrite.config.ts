import * as sdk from "node-appwrite";

/**
 * Configuration constants for the Appwrite service.
 * These constants are extracted from the environment variables.
 *
 * @constant {string} ENDPOINT - The endpoint URL for the Appwrite service.
 * @constant {string} PROJECT_ID - The project ID for the Appwrite service.
 * @constant {string} API_KEY - The API key for the Appwrite service.
 * @constant {string} DATABASE_ID - The database ID for the Appwrite service.
 * @constant {string} PATIENT_COLLECTION_ID - The collection ID for patients in the Appwrite database.
 * @constant {string} DOCTOR_COLLECTION_ID - The collection ID for doctors in the Appwrite database.
 * @constant {string} APPOINTMENT_COLLECTION_ID - The collection ID for appointments in the Appwrite database.
 * @constant {string} BUCKET_ID - The bucket ID for storage in the Appwrite service.
 */
export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new sdk.Client();

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
