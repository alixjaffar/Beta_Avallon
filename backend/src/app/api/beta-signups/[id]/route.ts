import { NextRequest, NextResponse } from 'next/server';
import { signupStorage } from '@/lib/signupStorage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const signupId = params.id;

    const deletedSignup = await signupStorage.deleteSignup(signupId);

    if (!deletedSignup) {
      return NextResponse.json(
        { success: false, message: 'Signup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Signup deleted successfully',
      deletedSignup: {
        id: deletedSignup.id,
        name: deletedSignup.name,
        email: deletedSignup.email,
      },
    });
  } catch (error) {
    console.error('Error deleting signup:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete signup' },
      { status: 500 }
    );
  }
}
