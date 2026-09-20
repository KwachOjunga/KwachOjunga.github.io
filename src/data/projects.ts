export interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  github?: string;
  featured: boolean;
  category: "Systems & Compilers" | "Fullstack & Web" | "DevOps & Cloud" | "Embedded & Hardware" | "CLI & Tools";
  date?: string;
}

export const projects: Project[] = [
  {
    title: "pliron-circt",
    description: "Dialect ecosystem for pliron, retaining parity with LLVM CIRCT / MLIR hardware IR. Implements hw (structural netlists and modules), comb (combinational logic), seq (clocked state and registers), and sv (SystemVerilog emission) dialects in Rust.",
    tech: ["Rust", "CIRCT", "MLIR", "Hardware IR", "SystemVerilog", "Compiler Design"],
    link: "https://github.com/KwachOjunga/pliron-circt",
    github: "https://github.com/KwachOjunga/pliron-circt",
    featured: true,
    category: "Systems & Compilers",
    date: "2026"
  },
  {
    title: "ksm-rs",
    description: "Port of Kisumu Lang to Rust. A custom programming language compiler and runtime engine featuring tokenization, an abstract syntax tree (AST) parser, type checking, and native execution.",
    tech: ["Rust", "Compiler Design", "AST", "Parsers", "Runtime Systems"],
    link: "https://github.com/KwachOjunga/ksm-rs",
    github: "https://github.com/KwachOjunga/ksm-rs",
    featured: true,
    category: "Systems & Compilers",
    date: "2026"
  },
  {
    title: "Kinga",
    description: "AI-powered anticipatory action trigger and activation engine for the IGAD region — turns pre-agreed early warning thresholds into automatic, tracked action, delivered via a resilient mesh network even when connectivity is down. Built for the IGAD Hackathon.",
    tech: ["AI Systems", "Mesh Networks", "Distributed Systems", "IoT", "Anticipatory Action"],
    link: "https://github.com/KwachOjunga/kinga",
    github: "https://github.com/KwachOjunga/kinga",
    featured: false,
    category: "Fullstack & Web",
    date: "2026"
  },
  {
    title: "HaDes-V Processor",
    description: "A synthesizable SystemVerilog hardware implementation of a 32-bit RISC-V processor core, featuring a 5-stage pipeline with hazard detection, operand forwarding, and branch handling.",
    tech: ["SystemVerilog", "RISC-V", "Digital Design", "FPGA", "Hardware Architecture"],
    link: "https://github.com/KwachOjunga/HaDes-V",
    github: "https://github.com/KwachOjunga/HaDes-V",
    featured: false,
    category: "Embedded & Hardware",
    date: "2026"
  },
  {
    title: "wrap-burn",
    description: "Python wrapper and ergonomic bindings for the Burn deep learning framework in Rust. Brings high-performance native tensor operations and neural network primitives to Python scripts.",
    tech: ["Rust", "Python", "PyO3", "Burn DL", "Machine Learning"],
    link: "https://github.com/KwachOjunga/wrap-burn",
    github: "https://github.com/KwachOjunga/wrap-burn",
    featured: true,
    category: "Systems & Compilers",
    date: "2026"
  },
  {
    title: "RV (RISC-V Designs)",
    description: "Architectural explorations and core hardware designs implementing the RISC-V instruction set architecture, with cycle-accurate simulation and verification in C++.",
    tech: ["C++", "RISC-V", "ISA Simulation", "Computer Architecture"],
    link: "https://github.com/KwachOjunga/RV",
    github: "https://github.com/KwachOjunga/RV",
    featured: false,
    category: "Embedded & Hardware",
    date: "2026"
  },
  {
    title: "mod-passes",
    description: "Examples and implementations of custom LLVM optimization passes using the LLVM opt tool and modern PassManager to transform intermediate representation (IR).",
    tech: ["LLVM", "LLVM IR", "C++", "Compiler Optimization"],
    link: "https://github.com/KwachOjunga/mod-passes",
    github: "https://github.com/KwachOjunga/mod-passes",
    featured: false,
    category: "Systems & Compilers",
    date: "2026"
  },
  {
    title: "peek",
    description: "Ultra-fast low-level CLI binary inspector written in Rust to inspect sections, memory segments, and headers in ELF/object files as fast as possible.",
    tech: ["Rust", "Binary Analysis", "ELF", "CLI", "Systems Programming"],
    link: "https://github.com/KwachOjunga/peek",
    github: "https://github.com/KwachOjunga/peek",
    featured: true,
    category: "CLI & Tools",
    date: "2026"
  },
  {
    title: "mips-cpu",
    description: "Pipelined 32-bit MIPS CPU implementation written in Verilog, featuring instruction fetch, decode, execute, memory access, and writeback stages.",
    tech: ["Verilog", "MIPS", "Digital Logic", "Computer Architecture"],
    link: "https://github.com/KwachOjunga/mips-cpu",
    github: "https://github.com/KwachOjunga/mips-cpu",
    featured: false,
    category: "Embedded & Hardware",
    date: "2026"
  },
  {
    title: "map_riscv",
    description: "Instruction mapping and decoding utility for the RISC-V ISA manual, automatically parsing machine opcodes, immediate formats, and register fields.",
    tech: ["Python", "RISC-V", "ISA Specification", "Automated Parsing"],
    link: "https://github.com/KwachOjunga/map_riscv",
    github: "https://github.com/KwachOjunga/map_riscv",
    featured: true,
    category: "Systems & Compilers",
    date: "2026"
  },
  {
    title: "rs_dicom",
    description: "Minimalist command-line utility in Rust for inspecting, validating, and interacting with DICOM medical imaging files and patient metadata.",
    tech: ["Rust", "DICOM", "Medical Systems", "CLI"],
    link: "https://github.com/KwachOjunga/rs_dicom",
    github: "https://github.com/KwachOjunga/rs_dicom",
    featured: false,
    category: "DevOps & Cloud",
    date: "2026"
  },
  {
    title: "Crypto Portfolio & Transaction Filter",
    description: "Decentralized transaction query engine and portfolio tracker for web3 blockchains, filtering transactions and visualizing asset distribution.",
    tech: ["TypeScript", "Next.js", "Web3", "Tailwind CSS"],
    link: "https://github.com/KwachOjunga/crypto-portfolio",
    github: "https://github.com/KwachOjunga/crypto-portfolio",
    featured: false,
    category: "Fullstack & Web",
    date: "2026"
  }
];
