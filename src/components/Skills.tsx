import Image from "next/image";
export default function Skills() {
    const skillCategories = [
        {
            title: "Languages",
            skills: ["Zig", "Mojo", "Python", "C/C++", "Rust", "Go"],
        },
        {
            title: "Toolkit",
            skills: ["Pytorch", "Keras", "Numpy", "SciPy", "Burn"],
        },
        {
            title: "Electronics",
            skills: ["Arduino", "RISC-V", "Circuit Design", "Embedded Systems"],
        },
        {
            title: "Currently Learning",
            skills: [
                "Computer Architecture",
                "Compiler design and Construction",
                "Microelectronic circuit design",
                "Machine Learning systems",
            ],
        },
    ];

    return (
        <section id="skills" className="py-20 px-4 max-w-4xl mx-auto">
            <div>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                        Technical Skills
                    </h2>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        A comprehensive toolkit for building robust
                        infrastructure systems.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillCategories.map((category, index) => (
                        <div key={index}>
                            <h3 className="text-yellow-300 font-semibold mb-4">
                                {category.title}
                            </h3>
                            <div className="space-y-2">
                                {category.skills.map((skill, skillIndex) => (
                                    <div
                                        key={skillIndex}
                                        className="text-secondary text-sm"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <br />
            <br />
            <div>
                <Image
                    // src="https://github-readme-stats.vercel.app/api/top-langs/?username=KwachOjunga&theme=dark&hide_border=false&include_all_commits=false&count_private=false&layout=compact"
                    src="https://github-contributor-stats.vercel.app/api?username=KwachOjunga&limit=5&theme=dark&combine_all_yearly_contributions=true"
                    width={495}
                    height={195}
                    alt="KwachOjunga's Contributor's Stats"
                    className="rounded-lg shadow-lg"
                />
            </div>
        </section>
    );
}
