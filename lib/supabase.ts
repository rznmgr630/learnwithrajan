import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && key && !url.startsWith("your_")
    ? createClient(url, key)
    : null;

export type TaskRow = {
  id: string;
  text: string;
  completed: boolean;
  scheduled_date: string;
  sort_order: number;
};
