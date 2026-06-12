import axios from "@/Utils/AxiosInstance";

// Ambil semua mata kuliah
export const getAllMataKuliah = () => axios.get("/mata-kuliah");
export const getAllMatakuliah = getAllMataKuliah;

// Ambil satu mata kuliah
export const getMataKuliah = (id) => axios.get(`/mata-kuliah/${id}`);
export const getMatakuliah = getMataKuliah;

// Tambah mata kuliah
export const storeMataKuliah = (data) => axios.post("/mata-kuliah", data);
export const storeMatakuliah = storeMataKuliah;

// Update mata kuliah
export const updateMataKuliah = (id, data) => axios.put(`/mata-kuliah/${id}`, data);
export const updateMatakuliah = updateMataKuliah;

// Hapus mata kuliah
export const deleteMataKuliah = (id) => axios.delete(`/mata-kuliah/${id}`);
export const deleteMatakuliah = deleteMataKuliah;
