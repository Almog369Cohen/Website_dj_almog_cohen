/** @type {import('next').NextConfig} */
// REVER_STATIC=1 → גרסת דמו סטטית (בלי שרת), למשל לכתובת /demo/rever באתר אחר
const isStatic = process.env.REVER_STATIC === "1";
const nextConfig = isStatic
  ? { reactStrictMode: true, output: "export", basePath: process.env.REVER_BASE_PATH || "", images: { unoptimized: true } }
  : { reactStrictMode: true, output: "standalone" };
export default nextConfig;
