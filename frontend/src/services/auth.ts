import api from './api';

interface LoginResponse {
  access_token: string;
  employee: {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
    position: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
    console.log('Sending request to backend...');
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
   console.log('Response received:', response.data); 
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};