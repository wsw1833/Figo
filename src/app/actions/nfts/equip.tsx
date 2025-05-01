'use server';
import { revalidatePath } from 'next/cache';

export const equip_nft = async (parentObj: string, componentObj: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/equip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parentObj, componentObj }),
  });

  const result = await response.json();

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: result.data,
    status: result.status || 200,
  };
};

export const unequip_nft = async (parentObj: string, componentObj: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/unequip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parentObj, componentObj }),
  });

  const result = await response.json();

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: result.data,
    status: result.status || 200,
  };
};
