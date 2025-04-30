'use server';

export const createOwner = async (walletAddress: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/owner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: walletAddress }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Server responded with ${response.status}`
      );
    }
    const result = await response.json();
    return { success: true, result: result.data, status: result.status || 200 };
  } catch (err) {
    return {
      success: false,
      error: err,
      status: 500,
    };
  }
};

export const fetchOwner = async (walletAddress: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
    const encodedAddress = encodeURIComponent(walletAddress);
    const response = await fetch(
      `${baseUrl}/api/owner?walletAddress=${encodedAddress}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Server responded with ${response.status}`
      );
    }
    const result = await response.json();
    return { success: true, result: result.data, status: 200 };
  } catch (err) {
    return {
      success: false,
      error: err,
      status: 500,
    };
  }
};
