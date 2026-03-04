import Image from "next/image";

export default function Hero() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center pt-20">
            <div className="text-center px-4 max-w-2xl mx-auto">
                <div className="mb-8">
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
                        <span className="text-cyan-500 font-medium">
                            Learning Processor and Compier design
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/*<a
                        href="#projects"
                        className="px-8 py-3 text-white rounded hover:opacity-90 transition-all duration-200"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        View My Work
                    </a>*/}
                    <a
                        href="#contact"
                        className="px-8 py-3 border text-secondary rounded transition-all duration-200 hover:opacity-90"
                        style={{ borderColor: "var(--color-secondary)" }}
                    >
                        Get In Touch
                    </a>
                </div>

                <div className="flex flex-col items-center gap-6 my-8">
                    <div className="">
                        <h3 className="text-2xl font-bold text-center">
                            My GitHub Activity
                        </h3>
                        <br />
                        {/*<Image
                            src="https://github-readme-stats.vercel.app/api?username=KwachOjunga&theme=dark&hide_border=false&include_all_commits=false&count_private=false"
                            alt="KwachOjunga's GitHub Stats"
                            width={495}
                            height={195}
                            className="rounded-lg shadow-lg"
                        />*/}

                        <Image
                            src="https://nirzak-streak-stats.vercel.app/?user=KwachOjunga&theme=dark&hide_border=false"
                            alt="KwachOjunga's Contribution Streak"
                            width={495}
                            height={195}
                            className="rounded-lg shadow-lg"
                        />

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
