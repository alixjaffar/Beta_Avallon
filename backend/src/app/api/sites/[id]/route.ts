import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { getSiteById, updateSite, deleteSite } from '@/data/sites';
import { z } from 'zod';

const UpdateSiteSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  customDomain: z.string().optional(),
  repoUrl: z.string().nullable().optional(),
  previewUrl: z.string().nullable().optional(),
  vercelProjectId: z.string().nullable().optional(),
  vercelDeploymentId: z.string().nullable().optional(),
  chatHistory: z.array(z.any()).nullable().optional(),
  websiteContent: z.any().nullable().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const site = await getSiteById(id, user.id);
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error('Error fetching site:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateSiteSchema.parse(body);

    const updatedSite = await updateSite(id, user.id, validatedData);
    if (!updatedSite) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deletedSite = await deleteSite(id, user.id);
    if (!deletedSite) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}