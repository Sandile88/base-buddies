function withValidProperties(
  properties,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET(request) {
  // Prefer explicit env var, but fall back to the current request origin.
  // As an extra guard (Vercel/Edge), reconstruct origin from forwarded headers.
  const requestOrigin = (() => {
    try {
      const fromUrl = new URL(request.url).origin;
      if (fromUrl) return fromUrl;
    } catch (_) {}
    try {
      const headers = request.headers || new Headers();
      const host = headers.get('x-forwarded-host') || headers.get('host');
      const proto = headers.get('x-forwarded-proto') || 'https';
      if (host) return `${proto}://${host}`;
    } catch (_) {}
    return undefined;
  })();

  const URL = process.env.NEXT_PUBLIC_URL || requestOrigin;

  // Build absolute URLs for required assets with sensible defaults
  const iconUrl = process.env.NEXT_PUBLIC_APP_ICON || (URL ? `${URL}/icon.png` : undefined);
  const ogImageUrl = process.env.NEXT_PUBLIC_APP_OG_IMAGE || (URL ? `${URL}/og-image.png` : undefined);

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Base Buddies",
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A fun onchain app built on Base!",
      screenshotUrls: [],
      iconUrl,
      homeUrl: URL,
      webhookUrl: URL ? `${URL}/api/webhook` : undefined,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
      tags: ["base buddies", "buddies", "social", "challenges", "rewards"],
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl,
      // use only while testing
      // "noindex": false
    }),
  });
} 