import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center pt-20">
            <div className="text-center px-4 max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-emerald-500/20 dark:ring-emerald-400/20 shadow-xl transition-transform duration-300 hover:scale-105">
                            <Image
                                src="/avatar.jpg"
                                alt="Reginald Ojunga"
                                fill
                                sizes="(max-width: 640px) 128px, 144px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
                        Reginald Ojunga
                    </h3>
                    <p className="text-xl md:text-2xl text-secondary font-normal mb-8">
                        Low Level Systems Engineer
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm text-secondary">
                        {/*<span>TypeScript</span>
            <span>•</span>*/}
                        <span>Python</span>
                        <span>•</span>
                        <span>Rust</span>
                        {/*<span>•</span>
            <span>Docker</span>*/}
                        <span>•</span>
                        <span>Electronics</span>
                        <span>•</span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                            Learning Processor and Compiler design
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center items-center">
                    <Link
                        href="/projects"
                        className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-semibold text-sm rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98]"
                    >
                        Explore Projects
                    </Link>
                    <Link
                        href="/blog"
                        className="px-6 py-2.5 border border-yellow-500/80 dark:border-yellow-400/70 text-yellow-700 dark:text-yellow-400 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-yellow-400/10 active:scale-[0.98]"
                    >
                        Read Blog
                    </Link>
                    <a
                        href="#contact"
                        className="px-6 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all duration-200 hover:border-yellow-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                        Get In Touch
                    </a>
                </div>

                <div className="flex flex-col items-center gap-6 my-8">
                    <div className="">
                        {/*<h3 className="text-2xl font-bold text-center">
                            My GitHub Activity
                        </h3>*/}
                        <br />
                        {/*<Image
                            src="https://github-readme-stats.vercel.app/api?username=KwachOjunga&theme=dark&hide_border=false&include_all_commits=false&count_private=false"
                            alt="KwachOjunga's GitHub Stats"
                            width={495}
                            height={195}
                            className="rounded-lg shadow-lg"
                        />*/}

                        {/*<Image
                            src="https://nirzak-streak-stats.vercel.app/?user=KwachOjunga&theme=dark&hide_border=false"
                            alt="KwachOjunga's Contribution Streak"
                            width={495}
                            height={195}
                            className="rounded-lg shadow-lg"
                        />*/}

                        {/*<Image
                            // src="https://github-readme-stats.vercel.app/api/top-langs/?username=KwachOjunga&theme=dark&hide_border=false&include_all_commits=false&count_private=false&layout=compact"
                            src="https://github-contributor-stats.vercel.app/api?username=KwachOjunga&limit=5&theme=dark&combine_all_yearly_contributions=true"
                            width={495}
                            height={195}
                            alt="KwachOjunga's Top Languages"
                            className="rounded-lg shadow-lg"
                        />*/}
                    </div>
                </div>
            </div>
        </section>
    );
}
