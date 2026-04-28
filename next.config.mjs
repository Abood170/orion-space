/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  experimental: {
    optimizePackageImports: ['motion', 'lucide-react', '@react-three/drei'],
  },
};

export default nextConfig;
