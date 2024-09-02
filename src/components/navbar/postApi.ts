import axios from "axios";

export async function postApiCall(url: string, data: any) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("API POST Request Error:", error);
    throw error; // Rethrow the error to handle it further if needed
  }
}
