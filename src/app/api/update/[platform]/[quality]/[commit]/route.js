import { NextResponse } from "next/server";
import { getLatestJSON, validateInput } from "@/utils/update-feed";

export async function GET(request, context) {
  try {
    const { platform, quality, commit } = await context.params;
    const input = validateInput(platform, quality);

    if (!input) {
      return NextResponse.json(
        { error: 'Invalid parameters' }, 
        { status: 400 }
      );
    }

    const latest = await getLatestJSON(input);

    if (!latest || !latest.version) {
      // 204 No Content is the standard response when no update is available
      return new Response(null, { status: 204 });
    }

    // Compare the client's current commit hash with the latest remote commit hash
    if (commit === latest.version) {
      // Up to date
      return new Response(null, { status: 204 });
    }

    // Return the update metadata so the client can trigger the download
    return NextResponse.json(latest);

  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}