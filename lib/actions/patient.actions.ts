"use server";

import { ID, Query, type Models } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import { type Patient } from "@/types/appwrite.types";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
/**
 * Creates a new user with the provided parameters.
 *
 * @param {CreateUserParams} user - The parameters for creating a new user.
 * @returns {Promise<Models.User | undefined>} The newly created user or the existing user if a conflict occurs.
 *
 * @throws Will throw an error if the user creation fails for reasons other than a conflict.
 *
 * @example
 * const user = {
 *   email: "example@example.com",
 *   phone: "+1234567890",
 *   name: "John Doe"
 * };
 *
 * createUser(user)
 *   .then(newUser => console.log(newUser))
 *   .catch(error => console.error(error));
 */
export const createUser = async (
  user: CreateUserParams
): Promise<Models.User | undefined> => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error) {
    console.error("An error occurred while creating a new user:", error);
    // Check existing user — type-narrow `unknown` to Appwrite error shape.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 409
    ) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      // Return the existing user if found
      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
/**
 * Retrieves the user details for the given user ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Models.User | undefined>} A promise that resolves to the user details.
 * @throws Will log an error message if the user details cannot be retrieved.
 */
export const getUser = async (userId: string): Promise<Models.User | undefined> => {
  try {
    // get user details from the database based on the provided userId
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
/**
 * Registers a new patient by uploading the identification document and creating a patient document.
 *
 * @param {RegisterUserParams} params - The parameters for registering a user.
 * @param {Blob} params.identificationDocument - The identification document to be uploaded.
 * @param {Object} params.patient - The patient details.
 * @returns {Promise<Patient | undefined>} The newly created patient document.
 *
 * @throws Will throw an error if the patient document creation fails.
 */
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams): Promise<Patient | undefined> => {
  console.log("🚀 ~ patient:", patient);
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile

    let file;
    // Upload identification document if provided
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );
      // Create file in storage
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );
    console.log("🚀 ~ newPatient:", newPatient);

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
/**
 * Retrieves a patient document from the database based on the provided userId.
 *
 * @param {string} userId - The unique identifier of the user whose patient document is to be retrieved.
 * @returns {Promise<Patient | null>} - A promise that resolves to the patient document if found, or null if no patient is found.
 * @throws {Error} - Throws an error if an issue occurs while retrieving the patient details.
 */
export const getPatient = async (
  userId: string
): Promise<Patient | null | undefined> => {
  try {
    // get patient document from the database based on the provided userId
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    console.log("🚀 ~ getPatient ~ patients:", patients);
    // Check if the documents array is empty
    if (patients.total === 0 || patients.documents.length === 0) {
      console.log("No patient found with the given userId");
      return null; // or throw an error if you prefer
    }
    // Return the first patient document found
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
