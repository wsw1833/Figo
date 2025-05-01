import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ParentNFT, ComponentNFT } from '@/models/schema';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    if (!body.parentObj || !body.componentObj) {
      return NextResponse.json(
        { success: false, error: 'objectIDs are required' },
        { status: 400 }
      );
    }

    const parent = await ParentNFT.findOne({ objectID: body.parentObj });
    if (!parent) {
      return NextResponse.json(
        {
          success: false,
          error: 'parentNFT does not exist',
        },
        { status: 404 }
      );
    }

    const component = await ComponentNFT.findOne({
      objectID: body.componentObj,
    });
    if (!component) {
      return NextResponse.json(
        {
          success: false,
          error: 'componentNFT does not exist',
        },
        { status: 404 }
      );
    }

    if (
      !parent.equipped_components ||
      !Array.isArray(parent.equipped_components) ||
      !component.equipped_on
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parent NFT has no equipped components array',
        },
        { status: 400 }
      );
    }

    await ParentNFT.updateOne(
      { objectID: body.parentObj },
      { $pull: { equipped_components: component._id } }
    );

    await ComponentNFT.updateOne(
      { objectID: body.componentObj }, // Find the component NFT
      { $set: { equipped_on: null } } // Set equipped_on to null
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Component has been unequipped from parentNFT',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/owners:', error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
