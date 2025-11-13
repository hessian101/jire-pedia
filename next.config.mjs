/** @type {import('next').NextConfig} */
const nextConfig = {
 // @react-three/fiberと@react-three/dreiを明示的にトランスパイル
 transpilePackages: ['@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;