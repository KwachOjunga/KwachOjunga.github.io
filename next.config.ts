// import type { NextConfig } from "next";
// import createMDX from '@next/mdx';

// const nextConfig: NextConfig = {
//   pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
// };

// const withMDX = createMDX({
//   options: {
//     remarkPlugins: [],
//     rehypePlugins: [],
//   },
// });

// export default withMDX(nextConfig);

import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === "production";

// IMPORTANT: Replace 'YOUR-REPO-NAME' with your actual GitHub repository name
// Example: if your repo URL is https://github.com/yourusername/learning-processor
//          then use 'learning-processor' (lowercase, exact match, no slash at start)
const repoName = "YOUR-REPO-NAME";

// For GitHub Pages → most common case is project site (username.github.io/repo-name)
// If it's your user/organization site (username.github.io without repo subfolder) → set both to ''
const basePath = isProd ? `/${repoName}` : "";
const assetPrefix = isProd ? `/${repoName}/` : ""; // note the trailing /

// Optional but strongly recommended for static exports with images
// (next/image default optimization doesn't work in export mode)
const images = {
    unoptimized: true,
};

const nextConfig: NextConfig = {
    // Enables static export → next build creates /out folder with pure HTML/JS/CSS
    output: "export",

    // Required for GitHub Pages when deployed in a subfolder
    basePath,
    assetPrefix,

    // If you use next/image → prevents build errors
    images,

    // Your existing MDX page extensions (already good)
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
    // You can add remark/rehype plugins here later if needed
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
});

// Export the composed config (MDX wrapper around nextConfig)
export default withMDX(nextConfig);
