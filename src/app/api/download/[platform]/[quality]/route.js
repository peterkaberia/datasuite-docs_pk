import { NextResponse } from "next/server";
import { getLatestJSON, validateInput } from "@/utils/update-feed";

export async function GET(request, context) {
    try {
        const { platform, quality } = await context.params;
        
        const input = validateInput(platform, quality);

        if (!input) {
            return NextResponse.json(
                { error: 'Invalid platform/quality combination' },
                {status: 400 }
            );
        }

        const latest = await getLatestJSON(input);

        if (!latest || !latest.url) {
            return NextResponse.json(
                { error: 'No release metadata found' },
                {status: 404 }
            );
        }

        return NextResponse.redirect(latest.url, {
            status: 302,
            headers: {
                'Cache-Control': 's-maxage=14400'
            }
        });

    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
        console.error('Download redirect API error:', e);
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        ); 
    }
}