import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { Owner } from '@/models/schema';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet address is required as a query parameter',
        },
        { status: 400 }
      );
    }

    const existingOwner = await Owner.findOne({
      walletAddress: walletAddress,
    })
      .populate({
        path: 'parentNFTs',
        populate: { path: 'equipped_components' },
      })
      .populate({
        path: 'componentNFTs',
        populate: { path: 'equipped_on' },
      });

    if (!existingOwner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Owner with this wallet address does not exist',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: existingOwner },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/owner:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Check if owner with this wallet address already exists
    const existingOwner = await Owner.findOne({
      walletAddress: body.walletAddress,
    });
    if (existingOwner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Owner with this wallet address already exists',
        },
        { status: 409 }
      );
    }

    // Create a new owner
    const owner = await Owner.create(body);

    return NextResponse.json({ success: true, data: owner }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/owner:', error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
