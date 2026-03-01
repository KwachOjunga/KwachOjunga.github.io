import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
    output: "export", // ← mandatory for static export to GitHub Pages

    // No basePath or assetPrefix needed for username.github.io repo!
    // (leave them out or set to undefined/'')

    images: {
        unoptimized: true, // Required in static export mode (no image server)
    },

    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    // trailingSlash: false,  // optional – usually false is fine for clean URLs
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
});

export default withMDX(nextConfig);
