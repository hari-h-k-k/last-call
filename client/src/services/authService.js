import api from "@/lib/axios";

const signup = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export default { signup, login };
