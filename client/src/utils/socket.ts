import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3000'

export const socket = io(URL, {auth: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI2YmY5YjljLTJlZDYtNDVhYi1iMjhkLWIwMzI2YjAyM2EwOSIsInVzZXJuYW1lIjoiVHV1a2thcmkiLCJpYXQiOjE3MDAxNzEwMDB9.ouGXhiBnM8YyGLALw1Z48LPoKrUGSQlpVVE11cSwyvg'}});
