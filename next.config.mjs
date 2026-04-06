/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Needed for @react-three/fiber
  transpilePackages: ['three'],
}

export default nextConfig
