import { api } from "./api";

// Upload Single File
export const uploadSingleFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};


// Upload Multiple Files
export const uploadMultipleFiles = async (files: FileList) => {
  try {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    const response = await api.post("/upload/multi", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
};
