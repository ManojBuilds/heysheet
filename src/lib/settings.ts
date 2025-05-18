import { createClient } from "./supabase/client";

interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  active: boolean;
  created_at: string;
}

// For API keys

export async function getApiKeys(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function createApiKey(
  userId: string,
  name: string,
  key: string,
  active: boolean
): Promise<ApiKey> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_keys")
    .insert([{ user_id: userId, name, key, active }])
    .select("*")
    .single();

  if (error) {
    console.log(error)
    throw error;
  }

  return data;
}

export async function updateApiKey(id: string, name: string, key: string, active: boolean): Promise<ApiKey> {

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('api_keys')
    .update([{ name, key, active }])
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteApiKey(id: string): Promise<void> {

  const supabase = await createClient();
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

// Email alert 

export async function getEmailAlert(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_notifications")
    .select("*")
    .eq("user_id", userId).single();
  if (error) throw error;
  return data;
}

export async function upsertEmailAlert({ userId, email, enabled }: { userId: string, email: string, enabled: boolean }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_notifications")
    .upsert(
      [{ user_id: userId, email, enabled }],
      { onConflict: "user_id" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateEmailAlert({ id, email, enabled }: { id: string, email: string, enabled: boolean }) {
  const supabase = await createClient();
  const {data, error} = await supabase.from("email_notifications").update([{ email, enabled }]).eq("id", id).select("*").single();
  
  if(error) throw error;
  return data;
}


// Validate api key
export async function validateApiKey(key: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key", key)
    .single();

  if (error) {
    if (error.code === "PGRST116") { 
      return null;
    }
    throw error;
  }

  return data;
}







