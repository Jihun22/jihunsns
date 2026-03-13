import type { NextConfig } from "next";

const remotePatterns: { protocol: "http" | "https"; hostname: string; port?: string }[] = [];
const candidateOrigins = [
  process.env.NEXT_PUBLIC_IMAGE_ORIGIN,
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.NEXTAUTH_URL,
  process.env.BACKEND_URL,
  "http://localhost:8080",
];

for (const origin of candidateOrigins) {
  if (!origin) continue;

  try {
    const url = new URL(origin);
    const protocol = url.protocol.replace(":", "");
    if (protocol !== "http" && protocol !== "https") continue;

    const hostname = url.hostname;
    const port = url.port || undefined;
    const duplicate = remotePatterns.some(
      (pattern) =>
        pattern.protocol === protocol && pattern.hostname === hostname && pattern.port === port,
    );
    if (duplicate) continue;

    remotePatterns.push({
      protocol: protocol as "http" | "https",
      hostname,
      port,
    });
  } catch {
    // invalid URL - skip
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
