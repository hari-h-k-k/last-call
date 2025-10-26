import api from "@/lib/axios";

const signup = async (data) => {
  const response = await api.post("/user/register", {
    username: data.username,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword
  });
  return response.data;
};

const login = async (data) => {
  const response = await api.post("/user/login", {
    usernameOrEmail: data.username,
    password: data.password
  });
  return response.data;
};

export default { signup, login };
