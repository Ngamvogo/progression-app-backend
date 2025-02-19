import supabase from "../config/db.js";

export const createTask = async (userId, title, duration, description) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ user_id: userId, title, duration, description }]);

  if (error) throw error;
  return data;
};

export const getTasks = async (userId) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId);

  if (error) throw error;
  return data;
};

export const deleteTask = async (taskId) => {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw error;
  return data;
};
