'use server';

import { revalidatePath } from 'next/cache';

export interface NFTFormData {
  objectID?: string;
  name?: string;
  description?: string;
  image?: string;
  component_type?: string | null;
}

export const createNFT = async (
  formData: NFTFormData,
  walletAddress: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
  const requestBody = {
    walletAddress,
    ...formData,
  };
  const response = await fetch(`${baseUrl}/api/owner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  revalidatePath(`${walletAddress}/main`);

  return {
    success: true,
    data: result.data,
    status: result.status || 200,
  };
};
