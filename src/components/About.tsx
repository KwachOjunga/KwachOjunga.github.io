export default function About() {
    return (
        <section id="about" className="py-20 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                    About Me
                </h2>
                <p className="text-xl text-secondary max-w-2xl mx-auto">
                    A passionate software engineer with a background in medical
                    image classification using deep learning&apos;s U-net
                    architectures and a solid foundation in low level system
                    design focusing on the hardware/software interface while
                    pursuing a degree in Medical Engineering at Technical
                    University of Mombasa.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">
                            Background
                        </h3>
                        <p>-</p>
                        <p className="text-secondary leading-relaxed">
                            I am a fifth year student of Medical Engineering at
                            Technical University of Mombasa. My skillset
                            encompasses deep learning architectures and
                            compilers, compiler design targeting modern
                            architectures with given parrallelism, circuit
                            analysis and embedded systems.
                        </p>
                        -
                        <br />
                        <p className="text-secondary leading-relaxed">
                            I am currently at{" "}
                            <a
                                className="text-blue-600 hover:text-yellow-
                                00 hover:no-underline transition-colors"
                                href="https://www.zone01kisumu.ke"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Zone01 Kisumu
                            </a>
                            <text> </text>
                            where I&apos;m a Software Developer Apprentice with
                            a focus on Machine Learning Systems.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4">
                        <div className="text-amber-400 text-4xl font-bold mb-2">
                            3+
                        </div>
                        <div className="text-amber-400 text-sm">
                            Years Experience
                        </div>
                    </div>

                    {/*<div className="text-center p-4">
                        <div className="text-3xl font-bold text-primary mb-2">
                            10+
                        </div>
                        <div className="text-secondary text-sm">
                            Projects Built
                        </div>
                    </div>*/}

                    <div className="">
                        {/*<div className="text-amber-400 text-3xl font-bold mb-2">
                            24/7
                        </div>*/}
                        {/*<div className="text-amber-400 text-sm">
                            Learning Mode
                        </div>*/}
                    </div>
                </div>
            </div>
        </section>
    );
}
