/** @type {import('next').NextConfig} */
const nextConfig = {
  "experimental": {
    "appDir": true,
    "serverComponentsExternalPackages": [
      "sharp"
    ],
    "optimizeCss": true,
    "optimizePackageImports": [
      "lucide-react",
      "framer-motion"
    ]
  },
  "images": {
    "domains": [
      "localhost"
    ],
    "formats": [
      "image/webp",
      "image/avif"
    ]
  },
  "compress": true,
  "poweredByHeader": false,
  "generateEtags": false
};

module.exports = nextConfig;