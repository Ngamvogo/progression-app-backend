import supabase from "../config/db.js";

export const createUser = async (name, email, password) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password }]);

  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
};
