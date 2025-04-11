// FOR API BASE URL
export const BASE_URL = process.env.BASE_URL as string;

export const API_URL = process.env.API_URL as string;

export const API_AUTH_TOKEN = {
  Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
};

// FOR BASE URL OF THE IMAGE
export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL as string;
