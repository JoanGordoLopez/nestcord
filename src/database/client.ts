// Import the createBrowserClient function from the Supabase JavaScript library
import { createBrowserClient } from "@supabase/ssr"

// Define constants for Supabase URL and anonymous key.
// These values are retrieved from the environment variables.
// The 'as string' assertion ensures that TypeScript treats these variables as strings.

// Create a Supabase client instance using the defined URL and anonymous key.
// This client can be used to interact with the Supabase backend services.
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
