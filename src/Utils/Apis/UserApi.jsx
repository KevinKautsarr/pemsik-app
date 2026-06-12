import axios from "@/Utils/AxiosInstance";

// Ambil semua user
export const getAllUsers = () => axios.get("/user");

// Ambil 1 user
export const getUser = (id) => axios.get(`/user/${id}`);

// Update data user (termasuk role & permission)
export const updateUser = (id, data) => axios.put(`/user/${id}`, data);

// Hapus user
export const deleteUser = (id) => axios.delete(`/user/${id}`);
