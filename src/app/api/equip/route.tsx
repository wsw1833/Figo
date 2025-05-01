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

    let parent = await ParentNFT.findOne({ objectID: body.parentObj });
    if (!parent) {
      return NextResponse.json(
        {
          success: false,
          error: 'parentNFT does not exist',
        },
        { status: 404 }
      );
    }

    let component = await ComponentNFT.findOne({ objectID: body.componentObj });
    if (!component) {
      return NextResponse.json(
        {
          success: false,
          error: 'componentNFT does not exist',
        },
        { status: 404 }
      );
    }

    parent.equipped_components.push(component._id);
    component.equipped_on = parent._id;
    await parent.save();
    await component.save();

    return NextResponse.json(
      { success: true, message: 'Component added to equipped_components' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/owners:', error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
