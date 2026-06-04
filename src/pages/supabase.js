import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://feqwygudsngolncjopgy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcXd5Z3Vkc25nb2xuY2pvcGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjUzNTAsImV4cCI6MjA5NjA0MTM1MH0.3SUpExdTk1hhHn9a54CbnkADjgIEPEqDUdqmZ8VTQeA";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);