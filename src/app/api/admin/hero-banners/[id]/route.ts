import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from '@/lib/auth/admin-middleware';
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/config";

import { heroBanners } from "@/lib/db/schema";

import { auth } from "@/lib/auth/config";


interface Props {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get specific hero banner
async function getHandler(request: NextRequest, { params }: Props) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [banner] = await db
      .select()
      .from(heroBanners)
      .where(eq(heroBanners.id, id))
      .limit(1);

    if (!banner) {
      return NextResponse.json(
        { error: "Hero banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Failed to fetch hero banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero banner" },
      { status: 500 }
    );
  }
}

// PUT - Update hero banner
async function putHandler(request: NextRequest, { params }: Props) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      badge,
      discount,
      cta,
      ctaLink,
      image,
      gradient,
      bgGradient,
      isActive,
      sortOrder,
    } = body;

    if (!title || !cta || !ctaLink) {
      return NextResponse.json(
        { error: "Title, CTA, and CTA link are required" },
        { status: 400 }
      );
    }

    const [updatedBanner] = await db
      .update(heroBanners)
      .set({
        title,
        subtitle,
        description,
        badge,
        discount,
        cta,
        ctaLink,
        image,
        gradient,
        bgGradient,
        isActive,
        sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(heroBanners.id, id))
      .returning();

    if (!updatedBanner) {
      return NextResponse.json(
        { error: "Hero banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("Failed to update hero banner:", error);
    return NextResponse.json(
      { error: "Failed to update hero banner" },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero banner
async function deleteHandler(request: NextRequest, { params }: Props) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [deletedBanner] = await db
      .delete(heroBanners)
      .where(eq(heroBanners.id, id))
      .returning();

    if (!deletedBanner) {
      return NextResponse.json(
        { error: "Hero banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Hero banner deleted successfully" });
  } catch (error) {
    console.error("Failed to delete hero banner:", error);
    return NextResponse.json(
      { error: "Failed to delete hero banner" },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
