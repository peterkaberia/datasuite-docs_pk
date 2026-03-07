import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { platform, quality } = await params;

    return NextResponse.json({
        platform,
        quality
    }); 
}