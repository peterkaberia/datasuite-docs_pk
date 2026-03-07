import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { platform, quality, commit } = await params;

    return NextResponse.json({
        platform,
        quality,
        commit
    }); 
}