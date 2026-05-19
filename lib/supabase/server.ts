import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      auditions: {
        Row: {
          id: string;
          audition_type: "upload" | "link";
          audition_url: string | null;
          audition_storage_path: string | null;
          name: string;
          email: string;
          phone: string | null;
          instrument: string;
          musical_taste: string;
          availability: string;
          location: string | null;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          audition_type: "upload" | "link";
          audition_url?: string | null;
          audition_storage_path?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          instrument: string;
          musical_taste: string;
          availability: string;
          location?: string | null;
          message?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["auditions"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let adminClient: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin() {
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  adminClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}
