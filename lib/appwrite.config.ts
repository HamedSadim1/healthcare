import * as sdk from "node-appwrite";

// Read each env var individually. Explicit `process.env.X` reads survive
// Next.js's NEXT_PUBLIC_* AST-replacement step; destructured
// `const { NEXT_PUBLIC_X } = process.env` does NOT always inline cleanly, so
// we assign each constant separately.
//
// `string | undefined` is intentional — readers detect missing config at
// first SDK call (the lazy getAdminClient() below) instead of at module-load.
// This keeps `import { databases } from "../appwrite.config"` safe at build
// time even when CI has no Appwrite secrets configured.
export const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
export const PROJECT_ID = process.env.PROJECT_ID;
export const API_KEY = process.env.API_KEY;
export const DATABASE_ID = process.env.DATABASE_ID;
export const PATIENT_COLLECTION_ID = process.env.PATIENT_COLLECTION_ID;
export const DOCTOR_COLLECTION_ID = process.env.DOCTOR_COLLECTION_ID;
export const APPOINTMENT_COLLECTION_ID = process.env.APPOINTMENT_COLLECTION_ID;
export const BUCKET_ID = process.env.NEXT_PUBLIC_BUCKET_ID;

// Singleton admin client. Constructed lazily so module-load does NOT call
// `client.setEndpoint(...)` (which throws AppwriteException "Endpoint must
// be a valid string" when NEXT_PUBLIC_ENDPOINT is missing). The first call
// to any exported SDK accessor (`databases`, `storage`, `users`,
// `messaging`) triggers construction; subsequent calls reuse the client.
let _adminClient: sdk.Client | null = null;

function getAdminClient(): sdk.Client {
  if (_adminClient) return _adminClient;

  // Fail-fast with a descriptive error rather than the SDK's generic
  // "Endpoint must be a valid string". Caught by Server Action try/catch
  // blocks so the build's SSG step never propagates this throw up to
  // Next.js (pages also opt in to `dynamic = 'force-dynamic'`).
  if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
    throw new Error(
      "Appwrite admin client misconfigured: NEXT_PUBLIC_ENDPOINT, PROJECT_ID, and API_KEY must all be set."
    );
  }

  _adminClient = new sdk.Client();
  _adminClient
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);
  return _adminClient;
}

// Lazy, callable proxy wrapper for each SDK service. The exported
// `databases` / `storage` / `users` / `messaging` constants are Proxy
// objects that only construct + configure the Appwrite client on first
// property access. This keeps every action call site (`databases.createDocument(...)`)
// unchanged while making the build resilient to missing env vars.
function lazyService<T extends object>(Ctor: new (client: sdk.Client) => T): T {
  let cached: T | null = null;
  return new Proxy({} as T, {
    get(_target, prop) {
      if (!cached) cached = new Ctor(getAdminClient());
      const value = (cached as unknown as Record<string | symbol, unknown>)[
        prop as string
      ];
      return typeof value === "function" ? value.bind(cached) : value;
    },
  }) as T;
}

export const databases = lazyService(sdk.Databases);
export const storage = lazyService(sdk.Storage);
export const users = lazyService(sdk.Users);
export const messaging = lazyService(sdk.Messaging);
