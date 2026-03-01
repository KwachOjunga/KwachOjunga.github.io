export default function Contact() {
    const socialLinks = [
        {
            name: "GitHub",
            url: "https://github.com/KwachOjunga",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
            ),
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/reginald-ojunga-5637631b9/",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        // {
        //     name: "Hashnode Blog",
        //     url: "https://jackkweyunga.hashnode.dev/",
        //     icon: (
        //         <svg
        //             className="w-6 h-6"
        //             fill="currentColor"
        //             viewBox="0 0 24 24"
        //         >
        //             <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z" />
        //             <path d="M12 6.75c-2.9 0-5.25 2.35-5.25 5.25s2.35 5.25 5.25 5.25 5.25-2.35 5.25-5.25S14.9 6.75 12 6.75zm0 8.4c-1.74 0-3.15-1.41-3.15-3.15S10.26 8.85 12 8.85s3.15 1.41 3.15 3.15S13.74 15.15 12 15.15z" />
        //         </svg>
        //     ),
        // },
        {
            name: "Dev.to",
            url: "https://dev.to/kwachojunga",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.81-.02c.38 0 .66-.05.84-.23.18-.16.27-.42.27-.78v-2.83c0-.36-.09-.62-.27-.78zm15.37-6.33c.37-.37.37-.98 0-1.36-.37-.37-.98-.37-1.36 0L12 11.79 2.57 2.36c-.37-.37-.98-.37-1.36 0-.37.37-.37.98 0 1.36L10.64 13.15 1.21 22.58c-.37.37-.37.98 0 1.36.37.37.98.37 1.36 0L12 14.51l9.43 9.43c.37.37.98.37 1.36 0 .37-.37.37-.98 0-1.36L13.36 13.15 22.79 3.72z" />
                </svg>
            ),
        },
        {
            name: "Gmail",
            url: "mailto:ojungakwach@gmail.com",
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 16.64l6.545-4.91-6.545-4.91v9.82z"
                        fill="#34A853"
                    />
                    <path
                        d="M12 16.64l-6.545-4.91 6.545-4.91v9.82z"
                        fill="#FBBC05"
                    />
                </svg>
            ),
        },
    ];

    return (
        <section id="contact" className="py-20 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                    Let&apos;s Connect
                </h2>
                <p className="text-xl text-secondary max-w-2xl mx-auto">
                    Available for consulting in low level systems design.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>

                    <div className="space-y-4">
                        <div>
                            <p className="font-medium mb-1">Location</p>
                            <p className="text-secondary">Nairobi, Kenya</p>
                        </div>

                        <div>
                            <p className="font-medium mb-1">Services</p>
                            <p className="text-secondary">
                                Compiler construction & Embedded systems design
                            </p>
                        </div>

                        <div>
                            <p className="font-medium mb-1">Education</p>
                            <p className="text-secondary">
                                (Partial) Medical Engineering, TUM
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-6">
                        Connect Online
                    </h3>

                    <div className="space-y-3">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-secondary hover:text-primary transition-colors"
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </a>
                        ))}
                    </div>

                    {/*<div className="mt-8">
                        <h4 className="font-medium mb-3">Recent Blog Posts</h4>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li>Strengthen OpenSSH Security through Ansible</li>
                            <li>Traefik Proxy Guide for Docker Containers</li>
                            <li>
                                Automate Deployment with Ansible and GitHub
                                Actions
                            </li>
                            <li>Upload Docker Images to GitHub</li>
                        </ul>
                    </div>*/}
                </div>
            </div>
        </section>
    );
}
