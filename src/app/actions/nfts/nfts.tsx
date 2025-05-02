'use server';

import { revalidatePath } from 'next/cache';
import { NFTFormData } from '@/lib/utils';

export const createNFT = async (
  formData: NFTFormData,
  walletAddress: string | null
) => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
  const requestBody = {
    walletAddress,
    ...formData,
  };
  const response = await fetch(`${baseUrl}/api/nfts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: result.data,
    status: result.status || 200,
  };
};
