import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getUsers = (token) =>
  axios.get(`${API_URL}/api/users`, {
    headers: { 'x-access-token': token }
  });

export const deleteUser = (id, token) =>
  axios.delete(`${API_URL}/api/users/${id}`, {
    headers: { 'x-access-token': token }
  });

export const signupUser = (data, token) =>
  axios.post(`${API_URL}/api/auth/signup`, data, {
    headers: { 'x-access-token': token }
  });

export const signinUser = (data) =>
  axios.post(`${API_URL}/api/auth/signin`, data);

export const getMe = (token) =>
  axios.get(`${API_URL}/api/auth/me`, {
    headers: { 'x-access-token': token }
  }); 