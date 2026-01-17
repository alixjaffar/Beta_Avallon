// API endpoint for managing custom domains
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { getSiteById, updateSite } from "@/data/sites";
import { VercelProvider } from "@/lib/providers/impl/vercel";
import { getCorsHeaders } from "@/lib/cors";

const AddDomainSchema = z.object({
  domain: z.string().min(1, "Domain is required").regex(
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    "Invalid domain format"
  ),
});

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

// Add custom domain
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(req);
  const { id: siteId } = await params;
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { domain } = AddDomainSchema.parse(body);

    logInfo('Adding custom domain', { siteId, domain });

    // Get the site
    const site = await getSiteById(siteId, user.id);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404, headers: corsHeaders });
    }

    // Check if site has a Vercel project
    if (!site.vercelProjectId) {
      return NextResponse.json({ 
        error: "Please publish your site first before adding a custom domain" 
      }, { status: 400, headers: corsHeaders });
    }

    // Add domain to Vercel
    const vercel = new VercelProvider();
    const result = await vercel.addDomain({
      projectId: site.vercelProjectId,
      domain,
    });

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || "Failed to add domain" 
      }, { status: 500, headers: corsHeaders });
    }

    // Update site with custom domain (store as comma-separated string)
    const existingDomains = site.customDomain ? site.customDomain.split(',').map((d: string) => d.trim()) : [];
    if (!existingDomains.includes(domain)) {
      existingDomains.push(domain);
    }
    
    await updateSite(siteId, user.id, { customDomain: existingDomains.join(',') });

    logInfo('Custom domain added successfully', { siteId, domain });

    return NextResponse.json({
      success: true,
      domain,
      dnsRecords: [
        {
          type: 'CNAME',
          name: domain.startsWith('www.') ? 'www' : domain.split('.')[0],
          value: 'cname.vercel-dns.com',
          ttl: 3600,
        },
        // For apex domains
        ...(domain.split('.').length === 2 ? [{
          type: 'A',
          name: '@',
          value: '76.76.21.21',
          ttl: 3600,
        }] : []),
      ],
      message: "Domain added! Please add the DNS records shown below.",
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Add domain failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

// Get domain info
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(req);
  const { id: siteId } = await params;
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const site = await getSiteById(siteId, user.id);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404, headers: corsHeaders });
    }

    const customDomains = site.customDomain ? site.customDomain.split(',').map((d: string) => d.trim()).filter(Boolean) : [];
    
    return NextResponse.json({
      customDomains,
      previewUrl: site.previewUrl,
      vercelProjectId: site.vercelProjectId,
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Get domain info failed', error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

// Remove custom domain
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(req);
  const { id: siteId } = await params;
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');
    
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400, headers: corsHeaders });
    }

    const site = await getSiteById(siteId, user.id);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404, headers: corsHeaders });
    }

    if (site.vercelProjectId) {
      const vercel = new VercelProvider();
      await vercel.removeDomain(site.vercelProjectId, domain);
    }

    // Update site to remove domain
    const existingDomains = site.customDomain ? site.customDomain.split(',').map((d: string) => d.trim()) : [];
    const updatedDomains = existingDomains.filter((d: string) => d !== domain);
    await updateSite(siteId, user.id, { customDomain: updatedDomains.length > 0 ? updatedDomains.join(',') : null });

    logInfo('Custom domain removed', { siteId, domain });

    return NextResponse.json({ success: true }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Remove domain failed', error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
