// src/services/imageAPI.js
import axios from "axios";

export const fetchPicsumImages = async (page = 1, limit = 40) => {
  const res = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
  return res.data;
};
