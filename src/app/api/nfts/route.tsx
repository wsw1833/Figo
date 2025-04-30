import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ParentNFT, Owner, ComponentNFT } from '@/models/schema';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    if (!body.walletAddress) {
      return NextResponse.json(
        { success: false, error: 'walletAddress is required' },
        { status: 400 }
      );
    }

    let owner = await Owner.findOne({ walletAddress: body.walletAddress });
    if (!owner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Owner with this wallet address does not exist',
        },
        { status: 404 }
      );
    }

    if (body.component_type) {
      const component = await ComponentNFT.create(body);
      owner = await Owner.findByIdAndUpdate(
        owner._id,
        { $addToSet: { componentNFTs: component._id } }, // $addToSet prevents duplicates
        { new: true }
      );
    } else {
      const parent = await ParentNFT.create(body);
      owner = await Owner.findByIdAndUpdate(
        owner._id,
        { $addToSet: { parentNFTs: parent._id } }, // $addToSet prevents duplicates
        { new: true }
      );
    }

    return NextResponse.json({ success: true, data: owner }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/owners:', error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
