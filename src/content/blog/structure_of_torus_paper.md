---
title: "How we went about incrementally designing paradigms that improved upon general purpose computing"
description: 
date:
author: "Reginald Ojunga"
---

# The history of hardware accelerators: From specialized arithmetic to TPU v4

A historical and architectural study of why hardware accelerators emerged, what problems each generation attempted to solve, and how those ideas culminated in Google's TPU v4.

The most useful way to study the history of hardware accelerators is not to begin with GPUs or neural networks. It is to begin with a much older problem:

General-purpose computers are designed to execute many different kinds of programs, but the computational requirements of individual applications are often very different.

A processor optimized for general-purpose execution must accommodate different instructions, control-flow patterns, memory-access patterns and data types.

That flexibility has a cost.

If an application repeatedly performs a particular operation, a specialized circuit may execute it with:

- Fewer instructions.
- Less control overhead.
- Lower energy consumption.
- Higher throughput.
- More predictable execution.
- Better utilization of memory bandwidth.

But specialization introduces its own problems:

- What happens when the workload changes?
- How much programmability should be sacrificed?
- How do we avoid building hardware that becomes obsolete?
- How should specialized processors communicate?
- How do we program and schedule heterogeneous hardware?
- How do we justify the manufacturing and engineering costs?

These tensions have shaped accelerator architecture for decades.

I would divide the history into nine major periods, culminating in TPU v4 in 2023.

[The IBM 650](https://images.openai.com/static-rsc-4/tdoOdozWB1P14qZN5_Fq7o6asK1c5R57WnavY19M5EM21O5GZgVg078gk9tUiG0T6AedJfDiAdpQfvIKMcl02Hml-KBgbolJAQE4L04bTC9Dv3NBxxsJoYx-yHZB2kl6Wde017dLefvvm0b6Vjri--psXeJPJK7g97-1BLlr4n8?purpose=inline)

[Süper Bilgisayar Nedir? Tarihte Üretilmiş 10 Süper Bilgisayar ve Özellikleri - Onedio](https://images.openai.com/static-rsc-4/sYx9KB2s4B7eGRXUMh32TtkmxUk-jzxSlClwFF9kJT6vasmvcbAd2QWgEADSRx49qwjzTAK2vvwWxwmliENPACeXM50wlWYplYWeHi_ydFoT_4pScDZRt8Q23ZYsJ0yLq75DgPaG61DrQKwRzGk0cSUfYgf5RERZ8wyYQ86H2qY?purpose=inline)

[Le premier GPU au monde fête ses 25 ans](https://images.openai.com/static-rsc-4/HJEgvHBkYUn1gCvYGOHpIXNwkbStbttDzOz8GIcgOv-UBnpldwuF8OZWq0tnqIjpnmbDzUGO-riA9YtTTwm_EkwKAhBe0HZwblrNCs9O6B48HHkUxNjXHCkBJE0xixARXzZAyUV9KPHcePgMJykuIRkUMXZAKeib-2bNY3N6wAs?purpose=inline)

## 1. The historical framework

Before examining individual machines, it helps to establish the distinction between several concepts.

| Architecture                | Principal idea                                     | Problem addressed                                  |
| --------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| General-purpose CPU         | Programmable sequential execution                  | General computation                                |
| Coprocessor                 | Delegate selected operations                       | Expensive operations on the CPU                    |
| DSP                         | Specialized numerical execution                    | Repeated signal-processing operations              |
| Vector processor            | Execute one operation over many elements           | High-volume numerical computation                  |
| GPU                         | Massive parallel execution                         | Graphics and later general-purpose parallelism     |
| FPGA                        | Reconfigurable hardware fabric                     | Application-specific hardware without a fixed ASIC |
| ASIC accelerator            | Fixed-function or programmable specialized silicon | Maximum efficiency for a target workload           |
| Domain-specific accelerator | Hardware organized around a computational domain   | Exploit stable application characteristics         |

One important distinction: these categories overlap. A GPU is an accelerator, an FPGA can implement an accelerator, and an ASIC may contain several different specialized execution engines.

Also, the history is not a simple progression in which newer architectures replaced older ones. CPUs, GPUs, DSPs, FPGAs and ASICs continue to coexist because they solve different problems.

# 2. 1940s–1960s: The origins of specialized computation

## 2.1 Why general-purpose computation was insufficient

Early computers were expensive, physically large and limited in computational capacity.

Scientific, military, engineering and commercial workloads often required repeated mathematical operations.

Examples included:

- Numerical integration.
- Differential equations.
- Matrix operations.
- Signal processing.
- Statistical calculations.
- Ballistic trajectory calculations.

The fundamental problem was that the cost of repeatedly performing arithmetic could dominate the execution of an application.

This encouraged the development of specialized arithmetic hardware.

One early example was the IBM 650 and its associated auxiliary equipment. More broadly, the emergence of floating-point hardware, dedicated arithmetic units and specialized scientific machines established the foundation for modern accelerator design.

## 2.2 Floating-point units and arithmetic coprocessors

[IBM 700 Series](https://images.openai.com/static-rsc-4/rgJ_6edYuHKBqLQJeG69Ypq7LrVObBioELVy2iKcxrj9CzB5z_S7cxyQv_qDsQucejOjRDVB36QGoPnMJUaYfHcNvsfNCYmk1hhAiX9JDa0o2RH_t-4nmxuOe8ZwmUbCm0pz_HfAWxSDg69yK4GF_aowvwdQW76-tPli2S0Tk84?purpose=inline)

[ibm.com](https://www.ibm.com/history/700?utm_source=chatgpt.com)

A central problem was that floating-point arithmetic was expensive to implement.

Floating-point operations require more than integer addition.

They involve:

1. Sign handling.
2. Exponent processing.
3. Mantissa arithmetic.
4. Normalization.
5. Rounding.
6. Exceptional-value handling.

Rather than implement every operation through a sequence of general-purpose instructions, designers developed dedicated floating-point units.

This introduced a fundamental accelerator pattern:

\\[ \text{General-purpose processor} + \text{Specialized arithmetic unit} \\]

The CPU could delegate expensive numerical operations to a dedicated unit.

This is the conceptual ancestor of modern coprocessors.

## 2.3 The IBM System/360 Model 91

[Tentang IBM](https://images.openai.com/static-rsc-4/ZO1Ko_XR9ZsATfuupDZxUQNda0JRCAO4HnBgwweZgRUhv7UC_bpPo7Bt66f9SiHDiVkcxj20A08SW9FTyYEA8jX2MzOTlAV-9EGx9FGUtJLxa_4OdjApjj9m124k2_ecDLpEUUvjG7JYkVrJdJ5PXTP7v6LF9ktMOEa-aEHcKc0?purpose=inline)

[ibm.com](https://www.ibm.com/id-id/about?utm_source=chatgpt.com)

The IBM System/360 Model 91 was an important development in high-performance computing.

It introduced sophisticated out-of-order execution mechanisms, register renaming and multiple execution units.

Although it was not an accelerator in the modern GPU or TPU sense, it illustrates an important architectural development:

Instead of executing every instruction strictly in program order, a processor can exploit independent operations and keep specialized execution units busy.

This raised an enduring question:

Should performance come from making one processor execute instructions more intelligently, or from building more specialized processing resources?

Both approaches would continue developing in parallel.

### The fundamental insight of this period

Specialization is valuable when the computational requirements of an application are sufficiently predictable.

But the next major challenge was how to exploit parallelism across large collections of data.

# 3. 1960s–1980s: Vector processors and the birth of modern HPC acceleration

Foundational architectural transition

This period is particularly important because many principles found in modern GPUs and TPUs were already being explored.

## 3.1 The problem: scalar execution does not scale efficiently

Imagine processing a vector of one million numbers.

A conventional scalar processor might execute:

```
load a[0]
load b[0]
add
store c[0]

load a[1]
load b[1]
add
store c[1]
...
```

The same operation is repeated across the entire dataset.

This creates instruction-fetch and instruction-decode overhead.

The underlying operation is simple, but the processor must repeatedly execute instructions describing it.

What if the hardware could execute one instruction across many elements?

That is the fundamental idea behind vector processing.

## 3.2 The CDC STAR-100

[PPT - Pipelined Vector Processing and Scientific Computation John G. Zabolitzky PowerPoint Presentation - ID:789627](https://images.openai.com/static-rsc-4/WIspjGhlWRkSb1arIzd4ZptQNRZ7iEsbVkkZV6abZ4Ix-R4F37fhHkl9X8TgXIfBhGbtBbcpTNnlx29LEZLY6KYJqY7Al8-3gKiHwBwooyBNrcIFz1lWg4iSNIt0CC8ya7GOJAKDVkEggOE8pPH19kPldESCysaAOoXyx8GydAE?purpose=inline)

[slideserve.com](https://www.slideserve.com/colleen/eine-zeitreise-in-die-welt-der-computer-powerpoint-ppt-presentation?utm_source=chatgpt.com)

The CDC STAR-100 was among the early machines to explore vector processing.

Its objective was to accelerate scientific computations involving large arrays.

Instead of executing an independent operation for every element, vector hardware could operate on collections of data.

The important innovation was moving computation closer to the structure of scientific workloads.

However, the STAR-100 also demonstrated a problem that would recur throughout accelerator history:

A machine may have excellent theoretical performance but perform poorly when applications do not expose enough vectorizable work or when memory cannot supply data quickly enough.

This is the origin of a recurring distinction between peak performance and sustained application performance.

## 3.3 The Cray-1

[Supercharging Science with Supercomputers - NSF Impacts | NSF - U.S. National Science Foundation](https://images.openai.com/static-rsc-4/W5relc5vqcrEku9mquhQyaifSUctY5SZhP6_MafBLCACCRDvgFWBbcBIkWZRhBvFt8tvCe_VUWMrkBgyITvCIRvY-_C3n0i_eaanLoziH8W7L1REZfTMxtVfVfIp8tz2gwZmfPANWUHuysx_rJrpQaydGREdszO2OjbGe86ZyWc?purpose=inline)

[nsf.gov](https://www.nsf.gov/impacts/supercomputers?utm_source=chatgpt.com)

The Cray-1 is one of the most important machines in computer architecture history.

Designed by Seymour Cray, it was introduced in 1976.

Its architecture combined:

- Vector registers.
- Pipelined functional units.
- High-bandwidth memory.
- Efficient instruction execution.
- A carefully designed physical layout.

The Cray-1's vector registers allowed data to be loaded and processed in batches.

For example:

\\[ C[i] = A[i] + B[i] \\]

Instead of repeatedly fetching individual values and issuing separate scalar additions, the processor could execute a vector operation over a group of elements.

The result was much higher arithmetic throughput for suitable workloads.

## 3.4 Why the Cray-1 mattered

The Cray-1 demonstrated that performance depended on balancing several architectural resources.

A vector processor requires:

1. Enough memory bandwidth to supply vector elements.
2. Sufficient register capacity to retain intermediate values.
3. Pipelined functional units.
4. Efficient data movement.
5. Applications that expose vectorizable operations.

This is directly related to the modern roofline model.

\\[ P = \min(P\_{\text{peak}},B\_{\text{memory}}\times I) \\]

A vector processor can have very high arithmetic throughput, but if memory cannot supply operands, that throughput is wasted.

This is a crucial connection to TPU v4: its MXUs, HBM and on-chip memories are modern expressions of the same underlying design problem.

## 3.5 The Connection Machine

[Timeline: Five significant computer technologies of the 1980's | Timetoast Timeline Maker](https://images.openai.com/static-rsc-4/9yWyWcNIAxeCf7oHk10va0_NIenE8NfITWfOWNdFbHZKlVha9ACnV4TQLENnOTVXHvvFHGkYDyZNWOl5i_O40Y2h48lIAHrIMjiGN1oT1l0UoY0qKRimoODFhgQE4tp9hZtgxWsf0Qm17AAUsBl6XuBtFwI3kdtTPgTAI7uKBiw?purpose=inline)

[timetoast.com](https://www.timetoast.com/timelines/80-s-aed91018-e11b-4a79-9238-3689085f8f1a?utm_source=chatgpt.com)

The Connection Machine CM-1 introduced another approach.

Rather than building a small number of extremely powerful vector processors, it used a large number of relatively simple processing elements.

The machine explored massively parallel computation.

Its underlying insight was that many applications could be expressed as operations distributed across collections of data.

This was especially interesting for:

- Scientific simulations.
- Image processing.
- Cellular automata.
- Artificial intelligence research.

It also introduced challenges:

- Communication overhead.
- Synchronization.
- Programming complexity.
- Load balancing.
- Physical network design.

These problems would later become central to GPU clusters and TPU supercomputers.

### What this period contributed

| Innovation                    | Problem it addressed                     |
| ----------------------------- | ---------------------------------------- |
| Vector registers              | Repeated scalar instruction overhead     |
| Pipelined arithmetic          | Functional-unit utilization              |
| High-bandwidth memory         | Supplying vector operations              |
| Massively parallel processing | Scaling computation beyond one processor |
| Interprocessor networks       | Coordinating distributed computation     |

The central insight: parallelism is not just about adding processors. It requires the memory system and communication architecture to supply and coordinate the work.

# 4. 1970s–1990s: DSPs, systolic arrays and reconfigurable computing

This period produced three architectural ideas that would eventually become central to modern accelerators:

1. Dedicated multiply-accumulate execution.
2. Spatially organized computation.
3. Hardware that can be reconfigured after fabrication.

They developed somewhat independently, but their ideas would eventually converge in neural-network accelerators.

## 4.1 Digital Signal Processors: designing around algorithms

[TMS32010JDL Texas Instruments DSP Digital Signal Processor Tms32010 NOS for sale online | eBay](https://images.openai.com/static-rsc-4/G31PROpQGNxc28yzT0dDZrtiKj_Jt39OnKoWdmspo2iaqFfV0FrzLuhnAzaE3Pcx8sSuWeUUjgzQLiE5IBUIOSevMGukoVtOyniUJYnZ93Z87L0LCutEiQIe1JalhiL3vJlZVT-fSjg3U2tobEbfUKI2edHp_droT0zwXjnYRrA?purpose=inline)

[ebay.com](https://www.ebay.com/p/1583689142?utm_source=chatgpt.com)

Digital Signal Processors emerged because conventional microprocessors were not particularly efficient at processing continuous streams of numerical data.

Consider digital audio processing.

A digital filter might repeatedly calculate:

\\[ y[n] = \sum\_{k=0}^{M-1} h[k]x[n-k] \\]

This is a multiply-accumulate operation repeated over a stream of samples.

The computational pattern is predictable.

The processor repeatedly:

- Loads a sample.
- Loads a coefficient.
- Multiplies them.
- Adds the result to an accumulator.
- Advances to the next sample.

Implementing multiplication through multiple general-purpose instructions would be inefficient.

The solution was to design processors around the dominant operations of signal-processing algorithms.

### Important milestone: Texas Instruments TMS32010 (1982)

The TMS32010 was one of the first commercially successful single-chip programmable DSPs.

Its architectural features included:

- Dedicated multiplier hardware.
- Multiply-accumulate operations.
- Specialized addressing modes.
- Efficient data movement.
- Hardware optimized for repetitive numerical workloads.

The dedicated MAC became one of the defining characteristics of DSP architecture.

[image](https://www.google.com/s2/favicons?domain=https://www.secs.oakland.edu\&sz=32)

IEEE Signal Processing Magazine+1

The problem being solved: real-time signal processing required predictable, high-throughput arithmetic at relatively low cost and power.

This architectural idea eventually found its way into image processors, GPUs, neural-network accelerators and TPUs.

## 4.2 Systolic arrays: making data move through computation

[Tensor Processing Unit (TPU): High Level System Architecture · QSysArch - Quantum Computer System Architecture](https://images.openai.com/static-rsc-4/qrOviXGeA4W823IDuHp0_86VwBuiigWXPXAAZRxJAhQTYvmJGGbkFb54hz5Ar3a0TlrAtUdieZqJg0-MXBZfMCHq5hOA7HywdM49R1USAdlH1PZLTU5VHFWPvzIfLg3Ya6H15XUAeTrVmQjK6Q2wT5Nuw4Oosytn7z9qI_hxmso?purpose=inline)

[qsysarch.com](https://qsysarch.com/posts/tpu-architecture/?utm_source=chatgpt.com)

This is one of the most important developments in the history of accelerators.

In 1978, H. T. Kung and Charles Leiserson published their foundational work on systolic arrays.

The motivation was closely connected to the limitations of VLSI technology.

As integrated circuits became denser, it became possible to place many processing elements on one chip.

But a new problem emerged:

Moving data across a chip could be expensive relative to performing a simple arithmetic operation.

A conventional architecture might repeatedly retrieve operands from a central memory.

Kung's insight was to organize processing elements into regular spatial arrangements where data moves locally between neighboring units.

A processing element performs a small computation and passes data to the next processing element.

Think of it as an assembly line.

A simplified systolic array

PE 1

MAC

PE 2

MAC

PE 3

MAC

PE 4

MAC

PE 5

MAC

PE 6

MAC

PE 7

MAC

PE 8

MAC

PE 9

MAC

Illustrative 3 × 3 arrangement. Actual dataflow depends on the algorithm and array organization.

For matrix multiplication:

\\[ C\_{ij}=\sum_k A\_{ik}B\_{kj} \\]

The hardware can arrange for operands to flow through the array while partial sums accumulate locally.

The benefits are substantial:

- Local communication.
- Predictable dataflow.
- High pipeline utilization.
- Operand reuse.
- Reduced external memory traffic.
- Regular physical implementation.

The key innovation was not simply parallel arithmetic.

It was coordinating computation and communication spatially.

Read Kung's original paper: [Special-purpose devices for signal and image processing: An opportunity in VLSI](https://www.eecs.harvard.edu/~htk/publication/1980-spie-kung.pdf?utm_source=chatgpt.com).

This is directly relevant to TPU v1.

Its matrix multiplication unit uses a systolic array, an architectural idea developed decades before deep learning became a major commercial workload.

## 4.3 Field-Programmable Gate Arrays: the flexibility problem

[Chip Hall of Fame: Xilinx XC2064 FPGA - IEEE Spectrum](https://images.openai.com/static-rsc-4/a7lETLZA1fmAS6YzUs1BHb0lkS0kR91Lyw7_xbSFJJS4ny1_6H1esytbUJpxoUg-hthIPqDtI5-HPmnEFP1DWXgKp0na5ryFMWKf6p-cccoiNG0otTaTCKLExjI50VF0GpvEXNmb3XgrP-4ACk4rI8ao5L6PYY3o20WHOD_h_nM?purpose=inline)

[spectrum.ieee.org](https://spectrum.ieee.org/chip-hall-of-fame-xilinx-xc2064-fpga?utm_source=chatgpt.com)

The FPGA emerged from a different problem.

Custom ASICs can be extremely efficient, but manufacturing a new chip is expensive and time-consuming.

What if a hardware designer could configure the logic after manufacturing?

In 1984–1985, Xilinx introduced the technology that became the FPGA.

The first generation included configurable logic blocks connected through programmable interconnects.

An FPGA allows developers to implement custom hardware structures without fabricating a new chip.

This created an interesting middle ground:

| ASIC                                   | FPGA                                         |
| -------------------------------------- | -------------------------------------------- |
| Fixed after fabrication                | Reconfigurable after fabrication             |
| High potential efficiency              | Greater flexibility                          |
| Expensive design and fabrication cycle | Shorter hardware development cycle           |
| Best for stable high-volume workloads  | Useful for evolving or specialized workloads |

FPGAs became important for:

- Telecommunications.
- Network processing.
- Industrial control.
- Image processing.
- Scientific computation.
- Hardware prototyping.

The DEC Programmable Active Memory and SRC Splash projects demonstrated that FPGAs could function as genuine computational accelerators, not merely glue logic.

[image](https://www.google.com/s2/favicons?domain=https://xplorestaging.ieee.org\&sz=32)

IEEE Xplore+2

The unresolved problem: FPGAs offer flexibility, but their programmable routing and logic structures generally sacrifice some density, frequency and energy efficiency compared with a purpose-built ASIC.

This tension between flexibility and specialization remains central to accelerator architecture.

# 5. 1980s–2000s: Graphics processors become parallel computers

One of the most influential transitions

The GPU is perhaps the most commercially consequential example of an accelerator evolving beyond its original purpose.

Its history is especially instructive because it demonstrates how a specialized processor can become a general computational platform.

## 5.1 The original problem: rendering graphics

A computer must transform geometric descriptions into images.

A simplified graphics pipeline looks like this:

[GPUCUDA 发展编年史：从 3D 渲染到 AI 大模型时代（上） - 技术栈](https://images.openai.com/static-rsc-4/eQxtYryNjSoeMIFfiXibjLNVxtF62jWv1SWO12TUAqXYsDksiXOk7fGNWSWNqDwDUmdmHST5fB0BB3TI63QhvEN74WZkkIO-HGGJTyO8ebp6GEP1-tWBOnjN7WWm8ScbB1-d2GMvOhdU-BTs5VMjnort-GV9CSkVZGD_opJoarA?purpose=inline)

[jishuzhan.net](https://jishuzhan.net/article/1930449254669135873?utm_source=chatgpt.com)

A rendering workload involves operations such as:

1. Vertex transformation.
2. Lighting calculations.
3. Primitive assembly.
4. Rasterization.
5. Texture mapping.
6. Pixel shading.
7. Frame-buffer operations.

These operations are performed over enormous numbers of vertices, triangles and pixels.

The CPU could perform these operations, but doing so became increasingly expensive as graphics complexity increased.

The solution was fixed-function graphics hardware.

Instead of having the CPU calculate every pixel, specialized circuits handled particular stages of rendering.

## 5.2 Fixed-function graphics accelerators

During the 1980s and 1990s, graphics hardware increasingly incorporated dedicated circuits for rendering operations.

The problem was straightforward:

Real-time graphics required enormous amounts of repetitive computation.

Fixed-function hardware delivered high throughput with relatively little programmability overhead.

However, fixed-function hardware introduced another problem.

As graphics techniques evolved, developers wanted functionality that the hardware did not support.

Adding every new rendering feature as a dedicated circuit became impractical.

## 5.3 Programmable shaders

[PPT - Advanced Graphics Programming with DirectX: Transform Your Visuals! PowerPoint Presentation - ID:9551588](https://images.openai.com/static-rsc-4/e39csLtQOzax8vypXSmp2B5VLqwFQ9aKumT6br84WYq9LshQ7ycZ_lQbVrSyIyALoNgpDaVVEBEcHlpYIOBiZRxr_i_46jPugUK3nh9KkJBCHt6UQtNESsIM9Z5-6dZmae_K44y7zC5Up8x52xs0WpkFczfe7HkPFnlJlfaPo5s?purpose=inline)

[slideserve.com](https://www.slideserve.com/plorna/advanced-programmable-shading-beyond-per-vertex-and-per-pixel-shading-powerpoint-ppt-presentation?utm_source=chatgpt.com)

The introduction of programmable shaders changed the GPU's architectural direction.

Instead of restricting developers to predetermined graphics operations, hardware began allowing programs to execute within parts of the rendering pipeline.

Important milestones:

- 1999: NVIDIA GeForce 256 popularized the GPU designation and hardware transform and lighting.
- 2001: GeForce 3 introduced programmable vertex shaders.
- 2002: Radeon 9700 advanced programmable pixel processing and floating-point graphics.
- 2006: NVIDIA G80 introduced a unified shader architecture.

The transition from fixed-function pipelines to programmable processing units was critical.

It meant that the GPU was becoming a collection of programmable parallel processors rather than just a graphics-rendering circuit.

[image](https://www.google.com/s2/favicons?domain=https://citeseerx.ist.psu.edu\&sz=32)

CiteSeerX+2

## 5.4 Unified shaders: solving pipeline imbalance

Early programmable GPUs had separate processing resources for different stages of rendering.

This could cause a utilization problem.

Imagine a graphics workload that needs:

- 20% vertex processing.
- 80% pixel processing.

If the hardware contains equal-sized vertex and pixel processing resources, much of the vertex hardware may remain idle.

The unified shader architecture addressed this.

Processing elements could be allocated dynamically to different shader workloads.

The NVIDIA G80, released in 2006, was an important milestone.

It combined unified programmable shader processors with a programming environment that would become central to general-purpose GPU computing.

[image](https://www.google.com/s2/favicons?domain=https://www.nvidia.com\&sz=32)

NVIDIA+1

## 5.5 GPGPU: general-purpose computation on GPUs

[PPT - Graphic Architecture introduction and analysis PowerPoint Presentation - ID:2856489](https://images.openai.com/static-rsc-4/D9dR9ureS07xWu_gYLVcIXrdscj7YXmHBh7lyD1hUEkr3MTi89yWai3sEYcTZgprWdya7oRMNGK9W2-Wg8I7S43AomTap9MDE54hdRyVD2S0rjR1nku6m6eQ0-D2Oy2A_vj55iBstzoYlmASxi3CB_wxRFCdiamyBYFTW27XwuA?purpose=inline)

[slideserve.com](https://www.slideserve.com/tynice/graphic-architecture-introduction-and-analysis?utm_source=chatgpt.com)

Researchers noticed that the same hardware used to process millions of pixels could perform other operations over large datasets.

Examples included:

- Matrix multiplication.
- Image processing.
- Physical simulations.
- Financial calculations.
- Scientific modelling.
- Numerical optimization.

Initially, programming these devices was awkward.

Developers often expressed computation through graphics APIs, textures and shaders.

The application was mathematically general-purpose, but the programming interface still assumed graphics.

This was the GPGPU era.

### CUDA (2006)

NVIDIA introduced CUDA alongside the GeForce 8800 generation.

CUDA provided a programming model that allowed developers to write computational kernels without disguising their algorithms as graphics operations.

This was a major software-architecture milestone.

The hardware was already capable of executing massively parallel operations. What was missing was a usable programming abstraction.

The CUDA model exposed:

- Parallel threads.
- Thread blocks.
- Grids.
- Shared memory.
- Synchronization.
- GPU memory management.

This made GPU computing accessible to a much wider range of scientific and engineering applications.

[image](https://www.google.com/s2/favicons?domain=https://www.nvidia.com\&sz=32)

NVIDIA+2

The historical lesson: an accelerator's success depends on its software ecosystem almost as much as its silicon.

# 6. 2000s: Heterogeneous processors and the problem of moving data

The next important development was the realization that adding processing elements was not enough.

The system needed to coordinate computation and memory movement.

## 6.1 IBM Cell Broadband Engine (2006)

[PPT - High Performance Simulations of Electrochemical Models on the Cell Broadband Engine PowerPoint Presentation - ID:4500194](https://images.openai.com/static-rsc-4/ZuSqn8wneRndxWlwkFVymn1jpLkV5xf_C9_AyPdNftNTYuHQ6mZAxOJKawB9LxpfWY8V3qYE08tKD8e8IxN8oHvQhtoBLHk-Y65Z82oGhA1ewg5jyhtLAJaMmXubJu6jDCmiVSebNMs1EvcgVBoniDUVal6OPdmxYqbLGTgel5A?purpose=inline)

[slideserve.com](https://www.slideserve.com/mikaia/high-performance-simulations-of-electrochemical-models-on-the-cell-broadband-engine-powerpoint-ppt-presentation?utm_source=chatgpt.com)

The Cell Broadband Engine was developed by IBM, Sony and Toshiba.

It was used in the PlayStation 3 and explored a heterogeneous multicore architecture.

Its major components included:

- One Power Processing Element (PPE).
- Eight Synergistic Processing Elements (SPEs).
- Local stores associated with SPEs.
- A high-bandwidth internal interconnect.
- Explicit data-transfer mechanisms.

The SPEs were designed for computationally intensive work.

Rather than relying entirely on conventional caches, they used local stores and explicit DMA transfers.

This is an important architectural choice.

Instead of expecting the hardware to automatically fetch all required data, software could explicitly manage data movement.

Why?

Because memory latency was becoming an increasingly important performance constraint.

The Cell architecture exploited several kinds of parallelism:

- Instruction-level parallelism.
- Data-level parallelism.
- Thread-level parallelism.
- Memory-level parallelism.
- Compute-transfer parallelism.

[image](https://www.google.com/s2/favicons?domain=https://research.ibm.com\&sz=32)

IBM Research+2

### What did Cell teach accelerator designers?

It demonstrated the potential of heterogeneous execution, but also exposed its programming difficulties.

Developers had to understand:

- Local-store capacity.
- DMA transfers.
- Data partitioning.
- Explicit synchronization.
- Work distribution.

This was an important lesson for later accelerator designs.

Hardware efficiency often comes at the cost of a more demanding software model.

## 6.2 The memory wall

During this period, processor performance was improving faster than memory latency.

This became known as the memory wall.

The problem is easy to understand.

Suppose a processor can perform many arithmetic operations per cycle but spends most of its time waiting for data.

Increasing the number of arithmetic units will not solve the bottleneck.

The industry responded through several techniques:

- Larger caches.
- Memory prefetching.
- Multiple memory channels.
- Non-blocking caches.
- DMA.
- Scratchpad memories.
- Wider memory interfaces.
- More sophisticated memory hierarchies.

This problem would become even more important in neural-network accelerators.

A modern accelerator might contain thousands of arithmetic units, but their effectiveness depends on how efficiently weights and activations reach them.

# 7. 2010–2016: The deep-learning revolution and the return of domain-specific architectures

This period fundamentally changed the accelerator industry.

The interesting development was not simply that neural networks became popular. It was that neural networks exposed a computational structure that could be exploited by specialized hardware.

## 7.1 The event that changed the industry: AlexNet (2012)

[ConvNet Architectures for beginners Part I | by Aryan Kargwal | SRM MIC | Medium](https://images.openai.com/static-rsc-4/6Ik8S8z4Qz-ZxZ5Z7Y58vRuYlR8JOAf2CR5kiBREP2h-GAIM72Kpltlkh9jNbSGdLIj_-sVb7_ZquVICgp58yZwLHsXKOAeAKf2F3MPn3GwvKcXeflqouODrtw2ykCT6JovflgRJ9MwhKZDhlyWfpNk1zcKKlqj88osh_AU-Hwo?purpose=inline)

[medium.com](https://medium.com/srm-mic/convnet-architectures-for-beginners-part-i-233aa9d1761b?utm_source=chatgpt.com)

In 2012, Alex Krizhevsky, Ilya Sutskever and Geoffrey Hinton demonstrated a major improvement in image classification using a deep convolutional neural network.

The model was trained using NVIDIA GPUs.

This was a significant demonstration of the practical value of general-purpose GPU computing for deep learning.

Why did GPUs work so well?

CNNs involve large amounts of:

- Matrix multiplication.
- Convolution.
- Multiply-accumulate operations.
- Vector arithmetic.
- Parallel activation processing.

These operations map naturally onto GPU execution resources.

The success of AlexNet demonstrated that commodity GPUs could substantially accelerate machine learning research and development.

But the growing adoption of neural networks introduced new architectural challenges.

## 7.2 The underlying computational structure of neural networks

Consider a fully connected neural-network layer:

\\[ Y = f(WX+b) \\]

Where:

- \\(W\\) represents the weight matrix.
- \\(X\\) represents input activations.
- \\(b\\) represents bias.
- \\(f\\) represents an activation function.

The dominant computation is matrix multiplication.

\\[ Y\_{ij} = \sum_k W\_{ik}X\_{kj} \\]

This operation consists of repeated multiply-accumulate calculations.

That is precisely the type of computation for which vector processors, DSPs and systolic arrays had already established useful architectural principles.

Deep learning was therefore not introducing an entirely new computational problem.

It was creating an enormous commercial demand for an old one: efficient numerical linear algebra.

However, neural networks also introduced new complications:

- Model sizes were growing.
- Training required repeated forward and backward passes.
- Activations and gradients required substantial memory.
- Inference introduced latency constraints.
- Different layers exhibited different computational characteristics.
- Numerical precision requirements varied across operations.

These problems motivated the development of domain-specific neural-network accelerators.

## 7.3 DianNao: a landmark neural-network accelerator

[\[Read Paper\] A Survey of Accelerator Architectures for Deep Neural Networks | SingularityKChen](https://images.openai.com/static-rsc-4/WntlPGu1fQsm5CH4QyRTWXhlfx9RlcTuneTTJtRdD9-iv9nqKEGA-KzrZppYXyd0KoE1em9uYzBSnIMpqoWxGWtBrgM4tri7hQf4LRBL3nce7B9k75PFUqz0Tj-Ag8PZJD_iOQv9t9lbKD1Azp3EIoHSZsTMfG94rwGqOlH17Gs?purpose=inline)

[singularitykchen.github.io](https://singularitykchen.github.io/blog/2020/03/01/Read-Paper-A-Survey-of-Accelerator-Architectures-for-Deep-Neural-Networks/?utm_source=chatgpt.com)

The DianNao project, published in 2014, was an important early demonstration of dedicated neural-network accelerator architecture.

Its objective was to exploit the repetitive computational structure of neural networks using specialized processing hardware.

Rather than building a general-purpose processor, it organized its resources around neural-network computation.

The architecture used specialized arithmetic units and local storage to accelerate neural-network operations.

Its significance was that it helped establish a research direction in which the architecture of the processor was designed around the structure of neural-network algorithms.

The broader DaDianNao work extended this thinking towards larger neural-network systems.

The problem being solved: general-purpose processors and GPUs were powerful, but their architectures contained functionality that neural-network workloads did not necessarily need.

Dedicated hardware could improve efficiency by eliminating unnecessary generality.

## 7.4 Eyeriss (2016): data movement becomes the primary concern

[Eyeriss Project](https://images.openai.com/static-rsc-4/WRtT-Gj8_Fv5LF2WInzDK_h1YVqrJP210uLWLew-F4ifcp-71PZFoQ12-tebjBe0OYFaQj4TC-5HUsBGJ1C4if1GIXL0dfmrT2xByi85mH0Zh7xIOrqWSHrgjLbWX8gtXf-WFQtLh_FLdvihEbo0Z_API8EDPPW8DGMNnoTwwlI?purpose=inline)

[mit.edu](https://www.mit.edu/~sze/eyeriss.html?utm_source=chatgpt.com)

The Eyeriss project is particularly important.

Its central contribution was a dataflow architecture called row-stationary.

The authors, Yu-Hsin Chen, Joel Emer and Vivienne Sze, identified an important problem:

Performing arithmetic is not necessarily the most expensive part of neural-network computation.

Moving data can consume more energy than performing the computation itself.

This is a crucial observation.

Consider a multiply-accumulate operation:

\\[ a \leftarrow a + b \times c \\]

The multiplication and addition may be relatively inexpensive, but retrieving \\(b\\) and \\(c\\) from external memory can be expensive.

If the architecture repeatedly fetches the same operands, it wastes energy.

Eyeriss attempted to minimize this through local data reuse.

Its row-stationary dataflow was designed to reuse:

- Filter weights.
- Input feature-map pixels.
- Partial sums.

It used 168 processing elements arranged spatially.

The architecture demonstrated that dataflow and memory organization were just as important as arithmetic throughput.

[image](https://www.google.com/s2/favicons?domain=https://dspace.mit.edu\&sz=32)

dspace.mit.edu+1

This is one of the most important intellectual connections to TPU v4.

TPU v4's MXUs are optimized around dense matrix operations, while its memory hierarchy and SparseCores address different data-access patterns.

Both reflect the same underlying principle:

An accelerator should be designed around how data moves through computation, not simply around how many arithmetic units it contains.

## 7.5 Other directions explored during this period

Not every research group pursued conventional digital neural-network accelerators.

There were several parallel approaches.

| Research direction             | Problem being investigated                                |
| ------------------------------ | --------------------------------------------------------- |
| Neuromorphic computing         | Reduce the energy cost of conventional neural computation |
| Analog neural accelerators     | Perform certain computations directly in analog circuits  |
| FPGA-based neural acceleration | Obtain specialization without committing to a fixed ASIC  |
| Systolic neural accelerators   | Exploit regular matrix and convolution operations         |
| Sparse accelerators            | Avoid unnecessary computation on zero-valued data         |
| Processing-in-memory research  | Reduce the distance data must travel to reach computation |

These approaches did not all achieve the same commercial adoption, but they broadened the architectural design space.

# 8. 2015–2019: Google's TPU and the industrialization of AI accelerators

The transition to production-scale domain-specific computing

The Google TPU is particularly significant because it was not merely an academic accelerator design.

It was created to solve an operational problem inside a large production datacenter.

## 8.1 Why Google needed a TPU

Google had been considering specialized hardware for neural networks as early as 2006.

But the situation changed in 2013.

Google projected that increasing usage of neural-network-based voice search could require a substantial expansion of datacenter capacity.

The company concluded that relying exclusively on conventional CPUs would be expensive.

Rather than wait for a long-term ASIC development process, Google designed and deployed its first TPU in approximately 15 months.

The TPU was deployed in datacenters in 2015 and publicly described in 2017.

This history is important because it demonstrates that accelerator design was driven by a concrete production workload rather than simply by a desire to increase benchmark performance.

[image](https://www.google.com/s2/favicons?domain=https://tamnd.github.io\&sz=32)

Tamnd+2

## 8.2 TPU v1 (2015 deployment, 2017 publication)

[Google opens up about its TPU chips for AI | VentureBeat](https://images.openai.com/static-rsc-4/GR0bS5C77Y6k2Cnup2WCl17ygFvYkF8ZNrspbf13BIShJDaq2uwE-e01NunOGtLnynF-mE8q6eQnI4zsd-rnYhYlOWGvjTGEm7UP8C77kd2i4nADjZUdSu3g7VLy_Uy0zegkpj99ru0zTXbrp5FyXtJRvFM1XX02YPfLFKmjdwY?purpose=inline)

[venturebeat.com](https://venturebeat.com/technology/google-opens-up-about-its-tpu-chips-for-ai?utm_source=chatgpt.com)

The first TPU was designed primarily for neural-network inference.

This distinction is essential.

Inference and training have different computational requirements.

| Inference                           | Training                                           |
| ----------------------------------- | -------------------------------------------------- |
| Uses an existing model              | Updates model parameters                           |
| Forward pass                        | Forward and backward passes                        |
| Often latency-sensitive             | Often throughput-sensitive                         |
| Can use integer quantization        | Requires training-oriented numerical formats       |
| Usually fewer temporary activations | Large intermediate activation and gradient storage |

The TPU v1 was optimized for inference.

Its important architectural characteristics included:

| Component       | TPU v1                   |
| --------------- | ------------------------ |
| Process         | 28 nm                    |
| Matrix unit     | 256 × 256 systolic array |
| Arithmetic      | 8-bit integer MAC        |
| Peak throughput | 92 TOPS                  |
| On-chip memory  | 28 MiB                   |
| Host connection | PCIe Gen3 x16            |
| Power           | Approximately 40 W       |

The matrix unit contained 65,536 multiply-accumulate units.

The key innovation was its ability to perform massive amounts of low-precision arithmetic with relatively little control overhead.

### Why 8-bit arithmetic?

Neural-network inference does not always require the same numerical precision as traditional scientific computing.

Many inference workloads can tolerate reduced precision when the model is appropriately quantized.

Using 8-bit integers provided several advantages:

- Smaller data representations.
- Greater arithmetic density.
- Reduced memory traffic.
- Lower energy per operation.
- More efficient systolic-array implementation.

This was an important departure from the assumption that high-performance computation must always rely on conventional 32-bit floating-point arithmetic.

### Why deterministic execution?

The TPU v1 paper also highlights a problem that is often overlooked.

Google's production inference services had strict response-time requirements.

Average throughput was not sufficient.

The 99th-percentile latency mattered.

A CPU or GPU may use dynamic scheduling, cache behavior, out-of-order execution and other mechanisms to improve average performance.

Those mechanisms can introduce execution-time variability.

The TPU's simpler, more deterministic execution model was better suited to some of these latency-sensitive inference workloads.

The authors reported substantial performance and performance-per-watt improvements over contemporary CPUs and GPUs on their evaluated production workloads.

[image](https://www.google.com/s2/favicons?domain=https://doi.org\&sz=32)

DOI+2

The key lesson: the best accelerator is not necessarily the one with the most sophisticated processor. It is the one whose architecture best matches the requirements of the workload.

## 8.3 TPU v2: moving from inference to training

[Hot Chips 2017: A Closer Look At Google's TPU v2 | Tom's Hardware](https://images.openai.com/static-rsc-4/b12zQvJewP5qw0fa6DLaL_tPvKdZmljVQgHS8HVI5YWY1KRy9ovStQlGG1DFIbVO9HHo9T7IXnde1Wpdj6dekY1IDJ_zdowuLxDP23x01VNGqZXcmwYaFzHU8GP1_LkoVe2gvF336aS1xpZQtsYgHQs5sb3FXg03SSWx5aJQMA8?purpose=inline)

[tomshardware.com](https://www.tomshardware.com/news/tpu-v2-google-machine-learning%2C35370.html?utm_source=chatgpt.com)

The next major challenge was training.

Google had already demonstrated that dedicated hardware could accelerate inference.

But could a specialized architecture support the much harder problem of distributed neural-network training?

Training involves:

1. Forward propagation.
2. Loss calculation.
3. Backpropagation.
4. Gradient calculation.
5. Parameter updates.
6. Repeated execution across many iterations.

This introduces substantial demands on memory capacity, memory bandwidth, communication and numerical precision.

TPU v2 addressed these requirements.

Its architectural changes included:

- Floating-point support through BF16.
- Multiple TensorCores.
- High-bandwidth memory.
- A high-speed inter-chip interconnect.
- Support for distributed training.

The introduction of BF16 was particularly important.

### Why BF16?

Traditional FP32 uses 32 bits.

BF16 uses 16 bits but retains the 8-bit exponent of FP32.

This gives it a similar dynamic range to FP32 while reducing the precision of the significand.

The advantages include:

- Half the storage per value.
- Higher data throughput.
- Lower memory bandwidth requirements.
- More efficient matrix arithmetic.

BF16 was particularly useful because neural-network training often tolerates reduced mantissa precision better than conventional scientific numerical algorithms.

This was a crucial architectural and numerical co-design decision.

## 8.4 TPU v3: scaling the training system

[Google's new TPU 3.0 revealed, REQUIRES liquid cooling](https://images.openai.com/static-rsc-4/qdUqJG318uDGtWH2u1621E5w1ukM-BPLoAY16SVuDKmGIZfY2SaBSPxNRiXjtKa7dR9hsM2vADBWfM5-WkmBBv3sYe3i5oE7V6gN_aPj6ALArVZDVnmEqvtqwc_luK3uZgfnNm54UqgmGgWXSF4DMNFGaqfuNAAsRXp9hS5gWMk?purpose=inline)

[tweaktown.com](https://www.tweaktown.com/news/61842/googles-new-tpu-3-0-revealed-requires-liquid-cooling/index.html?utm_source=chatgpt.com)

TPU v3 continued the transition towards large-scale distributed training.

Its improvements included:

- Increased computational performance.
- More memory capacity.
- Improved HBM bandwidth.
- Liquid cooling.
- Greater system-level scalability.

The TPU v2 and v3 systems used a 2D torus interconnect.

The supercomputer could scale to 1,024 chips.

The important issue was no longer simply whether one accelerator could perform matrix multiplication quickly.

It was whether hundreds or thousands of accelerators could work together efficiently.

This introduced several familiar HPC challenges:

- Collective communication.
- Synchronization.
- Network congestion.
- Memory distribution.
- Failure handling.
- Workload partitioning.

The 2020 paper, A Domain-Specific Supercomputer for Training Deep Neural Networks, is especially valuable for understanding this transition.

It describes how Google moved from an inference accelerator to a production training supercomputer.

[Read A Domain-Specific Supercomputer for Training Deep Neural Networks](https://gwern.net/doc/ai/scaling/hardware/2020-jouppi.pdf?utm_source=chatgpt.com).

[image](https://www.google.com/s2/favicons?domain=https://gwern.net\&sz=32)

gwern.net+2

# 9. 2020–2023: TPU v4 and the shift towards system-level accelerator design

[GoogleのAI用プロセッサ「TPU v4」はNVIDIAの「A100」より高速で効率的だとGoogleの研究者が主張 - GIGAZINE](https://images.openai.com/static-rsc-4/3a2-LONJTZKiwMkyrXk_EAYd7zY_-jd7Z-XivlliXJwBvrH5jHmtX04QcTnC6DXMhuz7i66bAt19S2OLnB0y-KK1oZ83rPHhdmrPnnNiEsI5peSfIRQwN0gxJXFpScB4IgYzx_3d1PPLX06UkyvNpvcG3hhPVETIE2Emjbe0CXA?purpose=inline)

[gigazine.net](https://gigazine.net/news/20230406-google-tpu-v4-outperforms-nvidia-a100/?utm_source=chatgpt.com)

TPU v4 is best understood as the convergence of several decades of architectural development.

It combines ideas from:

- Vector processing.
- DSPs.
- Systolic arrays.
- Distributed memory.
- Heterogeneous computing.
- Optical networking.
- Domain-specific architecture.
- Fault-tolerant supercomputing.

The workload had also changed.

Early TPUs were motivated heavily by neural-network inference.

TPU v2 and v3 moved into large-scale training.

TPU v4 had to accommodate a much broader production workload, including recommendation systems, Transformers and large language models.

This introduced two particularly important problems.

## 9.1 Problem one: dense matrix multiplication was no longer the whole story

Neural-network workloads increasingly included embedding operations.

An embedding table is essentially a large collection of learned vectors.

A categorical identifier selects a vector from the table.

This creates irregular memory accesses rather than the regular accesses associated with dense matrix multiplication.

Google's response was SparseCore.

The key idea was to provide a dedicated execution architecture for embedding workloads instead of forcing all operations through the matrix multiplication engine.

## 9.2 Problem two: the network was becoming a computational bottleneck

The growth of distributed workloads meant that a fixed network topology could limit performance and operational flexibility.

Google introduced optical circuit switching.

The system could reconfigure physical connectivity to accommodate different workload communication patterns and hardware availability.

This was a particularly important development because it moved topology selection into the operational architecture of the supercomputer.

## 9.3 The convergence

## The architectural lineage of TPU v4

Vector processing

Batch arithmetic and pipelined numerical execution.

DSP and systolic arrays

MAC specialization, regular dataflow and local operand reuse.

GPU and heterogeneous computing

Massive parallelism, programmable execution and memory management.

Neural-network accelerators

Quantized arithmetic, matrix engines and dataflow optimization.

TPU v1–v3

Inference ASIC evolving into a distributed training supercomputer.

TPU v4

Heterogeneous computation, embedding acceleration, reconfigurable optical topology and fault-aware system design.

The TPU v4 paper was published at ISCA 2023, although the system had been deployed since 2020.

Its three particularly important contributions were:

1. Production deployment of optical circuit switching in a supercomputer.
2. Detailed disclosure of specialized embedding hardware through SparseCore.
3. Co-optimization of machine-learning workloads, SparseCore and network topology.

[image](https://www.google.com/s2/favicons?domain=https://arxiv.org\&sz=32)

arXiv+2

# 10. The parallel history: CPU-integrated acceleration

It is important not to overlook what happened inside general-purpose processors during this period.

While GPUs and ASICs developed as separate processors, CPU designers were also integrating specialized execution resources into conventional processors.

This produced another architectural lineage.

| Period      | Technology          | Architectural contribution                                   |
| ----------- | ------------------- | ------------------------------------------------------------ |
| 1980        | Intel 8087          | External floating-point coprocessor                          |
| 1980s       | Integrated FPUs     | Floating-point execution becomes part of mainstream CPUs     |
| 1997        | Intel MMX           | Packed integer SIMD operations                               |
| 1999        | Intel SSE           | SIMD floating-point operations                               |
| 2000s       | SSE2/AVX precursors | Wider vector execution                                       |
| 2011        | AVX                 | 256-bit vector operations                                    |
| 2016 onward | AVX-512             | Wider vector execution and additional specialized operations |

The Intel 8087 is particularly interesting because it illustrates the evolution from external accelerators to integrated execution units.

Initially, the CPU delegated floating-point work to another chip.

Eventually, floating-point execution became a standard component of mainstream processor architectures.

[image](https://www.google.com/s2/favicons?domain=https://epubs.siam.org\&sz=32)

SIAM Publications Library+2

This raises an interesting architectural question:

When does a specialized accelerator become sufficiently important that it should be integrated into the general-purpose processor?

We see this happening with:

- Floating-point units.
- Vector execution units.
- Cryptographic extensions.
- Matrix multiplication engines.
- Neural-network execution units.

The boundary between a CPU and an accelerator is therefore not absolute.

An accelerator can begin as an external device, become an integrated coprocessor, or eventually become a standard execution unit.

# 11. The recurring problems that shaped accelerator history

Looking across these developments, I would identify eight fundamental problems that explain almost the entire history.

1\. Computational throughput

Problem: General-purpose instruction execution introduces overhead for repetitive operations.

Historical responses: Vector processors, DSPs, SIMD, MAC units, GPUs and systolic arrays.

2\. Memory bandwidth and latency

Problem: Processing units spend time waiting for operands.

Historical responses: Vector registers, caches, scratchpads, DMA, HBM and local data reuse.

3\. Energy consumption

Problem: Computation and especially data movement consume substantial energy.

Historical responses: Reduced precision, quantization, specialized arithmetic, dataflow optimization and local memory.

4\. Communication overhead

Problem: Increasing the number of processors introduces synchronization and communication costs.

Historical responses: Systolic arrays, SIMD, local interconnects, torus networks and optical switching.

5\. Flexibility

Problem: Highly specialized hardware can become unsuitable when applications change.

Historical responses: FPGAs, programmable GPUs, programmable DSPs and heterogeneous architectures.

6\. Programming complexity

Problem: Hardware efficiency is difficult to exploit without suitable programming abstractions.

Historical responses: Fortran vectorization, CUDA, OpenCL, TensorFlow, XLA and specialized compiler toolchains.

7\. Reliability and availability

Problem: Large systems are increasingly affected by component failures.

Historical responses: Redundancy, fault-tolerant interconnects, checkpointing and topology reconfiguration.

8\. Manufacturing and deployment cost

Problem: Highly specialized silicon is expensive to design, manufacture and deploy.

Historical responses: Reconfigurable logic, reusable IP, programmable accelerators, modular systems and production-scale ASICs.

This classification is useful because it allows you to understand a new accelerator without being distracted by its marketing terminology.

Whenever you encounter a new architecture, ask which of these problems it is primarily attempting to solve.

# 12. A chronological map of the important innovations

Here is the condensed timeline I would keep as a historical reference.

| Year       | Innovation                                    | Central problem being solved                            |
| ---------- | --------------------------------------------- | ------------------------------------------------------- |
| 1960s      | Floating-point execution units                | Expensive numerical arithmetic                          |
| 1967–1970s | Mainframe arithmetic and vector architectures | Scientific computational throughput                     |
| 1972       | CDC STAR-100                                  | Scalar instruction overhead                             |
| 1976       | Cray-1                                        | Efficient vector execution and memory access            |
| 1978       | Systolic arrays                               | Expensive long-distance data movement                   |
| 1980       | Intel 8087                                    | Slow floating-point execution on CPUs                   |
| 1982       | TI TMS32010                                   | Real-time DSP computation                               |
| 1984–1985  | FPGA invention                                | ASIC inflexibility                                      |
| 1985       | Connection Machine                            | Massively parallel computation                          |
| 1990s      | Fixed-function graphics accelerators          | Real-time rendering                                     |
| 1997–1999  | MMX and SSE                                   | Efficient data-parallel CPU execution                   |
| 1999       | GeForce 256                                   | Dedicated graphics processing                           |
| 2001–2002  | Programmable shaders                          | Fixed-function graphics limitations                     |
| 2006       | NVIDIA G80 and CUDA                           | General-purpose GPU programming                         |
| 2006       | IBM Cell                                      | Heterogeneous execution and data movement               |
| 2012       | AlexNet on GPUs                               | Deep-learning computational throughput                  |
| 2014       | DianNao                                       | Specialized neural-network execution                    |
| 2015       | Google TPU v1 deployment                      | Efficient production inference                          |
| 2016       | Eyeriss                                       | Energy-efficient neural-network dataflow                |
| 2017       | TPU v1 public architecture paper              | Production DSA disclosure                               |
| 2017       | TPU v2/v3 supercomputers                      | Distributed training                                    |
| 2020       | TPU v2/v3 architecture publication            | Production-scale DSA supercomputing                     |
| 2023       | TPU v4 paper                                  | Reconfigurable interconnects and embedding acceleration |

This is a selected timeline, not a claim that these were the only important accelerator developments. It emphasizes the architectural lineage leading to TPU v4.

# 13. The papers I would use to reconstruct this history

I would prioritize original architectural papers over retrospective articles wherever possible.

The following reading collection will give you access to the actual reasoning behind the innovations.

## Period I — Vector processing and parallel architectures

[Cray-1A - CHM Revolution](https://images.openai.com/static-rsc-4/UQ603cB4bgMzMUiyx6uDxriQANG9Yal5cs1QaONFS2n1RBlo1349z4UaMW4a6r_7uyQkk0p51PI7HLiiXv5yisVC-pJcRBuCjzHB7GLQv-_aw-uqHryhKozwxDjbOXwVz5FQpAVdyTGytXpLAoRd09g21Oniz4TGItFZQYV1M2o?purpose=inline)

The CRAY-1 Computer System (1978)

Richard M. Russell.

Understand vector registers, chaining, pipelining and the physical constraints of vector computers.

[Read the technical history](https://tcm.computerhistory.org/ComputerTimeline/Chap44_cray1_CS2.pdf?utm_source=chatgpt.com)

[Computer Architecture Dataflow Part II and Systolic Arrays](https://images.openai.com/static-rsc-4/QLKEqh-AOniQ56Brcq9UMe0Rcey1LLD1kOwdPb7xLQHiTVEaGcAIx_DcKDWq5HEc1ccvOptO0szRUmo2-kNidxUA8VwhdUr3vJBwrJO69a_wj8l-t3CVUhoC34nadWKmUpuNkP0GBem_EQN66zQgCGQPfzOEIVToII8IBjHygRY?purpose=inline)

Special-purpose Devices for Signal and Image Processing: An Opportunity in VLSI (1982)

H. T. Kung.

Essential for understanding the foundations of systolic architecture.

[Read the paper](https://www.eecs.harvard.edu/~htk/publication/1980-spie-kung.pdf?utm_source=chatgpt.com)

## Period II — Reconfigurable and heterogeneous architectures

[FPGA-internals · HOME](https://images.openai.com/static-rsc-4/KaA706IoCyemUiibgFbb8dNTVdhKYvKv-6XeJWIemvgk2IZPhkA1hhCPE47HsmVe-5jTgRUy-N4CkxJOSXTKG_1t7TanzaMsWcubUHKVKYEzqiBNux6JchQAkI5i0LS2nPAebfM-dStH2NYOMn45mTy0IiPAOTEfElz8JBSieFk?purpose=inline)

Three Ages of FPGAs (2018)

A historical account of the evolution of FPGA architecture.

[Read the IEEE paper](https://xplorestaging.ieee.org/document/8392473/?utm_source=chatgpt.com)

[PPT - Cell Broadband Engine PowerPoint Presentation, free download - ID:9248559](https://images.openai.com/static-rsc-4/DRBgJuhYm7b4YR9v68exxbfFeFc0xQ246t03bAypqlhb_fmoPlyEqzAxY6YKHPukbAqEIGxRf1YbDIwW9g1qYNuqYYUjCzEisqgSwNzNBgx3MDe2D68gOk4x3rpPDRDJGnvEwOur9mm2ozmHETCjiQknQFCd9wDhvZait8EvmaA?purpose=inline)

The Cell Broadband Engine: Exploiting Multiple Levels of Parallelism in a Chip Multiprocessor (2007)

Understand local stores, heterogeneous execution, DMA and compute-transfer parallelism.

[Read the paper](https://research.ibm.com/publications/the-cell-broadband-engine-exploiting-multiple-levels-of-parallelism-in-a-chip-multiprocessor?utm_source=chatgpt.com)

## Period III — GPU computing

[A Survey of GeneralPurpose Computation on Graphics Hardware](https://images.openai.com/static-rsc-4/Za8a9F5VT0Zg9o9Ix3f64aKEprs4lMaa4MydM5zGkxt_QEnnLrYqoiKOS2WOAKRMWKkur8DHSmMU9_MvTdrJzD_GSvzGhmVgg6y7b8nUNW6fECZgaxQYSh-vTDBjlNdbeXHpBOGqw0co0qJDG-XbxY0guJXTxscJ79DV6wS0JeY?purpose=inline)

A Survey of General-Purpose Computation on Graphics Hardware (2005)

Owens et al.

Understand how graphics hardware became a general-purpose parallel computing platform.

[Read the paper](https://lacuna.tiptreesystems.com/work/a-survey-of-general-purpose-computation-on-graphics-hardware/wrk_8bb493a0dcc21badee3b8e770c8c8928?utm_source=chatgpt.com)

## Period IV — Neural-network accelerators

[Overall architecture of DianNao. Many-core AI chip is composed of... | Download Scientific Diagram](https://images.openai.com/static-rsc-4/0l3yLSwzJIJE_BNVyxw_cyjrgmpLIjoLTkld5g-j83fUgtIRWqlUCDZtKDOy5OPWePt2NQqBTJKlDTw9th495S4ePMjMJ6oc-KoXWuDC_FaJsIGofjYULhRkjNmY3_HCClM0hjeeV7S22hoHq1ezWZTRMkh9-vI-rZS0pM--5GE?purpose=inline)

DianNao (2014)

Study the early move towards neural-network-specific processing architectures.

[Eyeriss Introduction | PDF](https://images.openai.com/static-rsc-4/Y8yuc0M48nEDwUaF3eGcKhufc0gTVlYd6Ytl9_0iStlmPNkF0vENZqZmCNnSOHd_egEWOWsdfLpU8vLVAHaA4-ZGCVsE4k9DnXsl8LkGu3t7q1cRj27ohcDC_pFVcfpPdvAjEwCVHuzIEZRgIYVXXxdqJCbPKXtmlJZWDe6xB7M?purpose=inline)

Eyeriss (2016)

Study spatial architectures, local reuse and energy-aware dataflow.

[Read the original paper](https://dspace.mit.edu/entities/publication/f6342515-2b7d-411c-a8ad-a9edb23dd394?utm_source=chatgpt.com)

[Google の Tensor Processing Unit (TPU) で機械学習が 30 倍速くなるメカニズム | Google Cloud 公式ブログ](https://images.openai.com/static-rsc-4/ZEM4pwWSO_a8xTJHMorUiwBn1enXIWcTlZEZph1VGqe3m0TV0XCnxbBY4fz_rs6KDBxeQzSGQduhfFQyeyRz7rC1gta30B-yQzB8gN4RcZlE8Kd8iyWx8zkbpIljUZI1Va_D3s5OK2aOwrtQsIhovptDIlWAOcvw_60p40gqH1w?purpose=inline)

In-Datacenter Performance Analysis of a Tensor Processing Unit (2017)

Understand why Google built the first TPU and why its architecture was suitable for production inference.

[Read the original paper](https://doi.org/10.1145%2F3140659.3080246?utm_source=chatgpt.com)

## Period V — Distributed AI supercomputers

[AI Chips Technology Trends & Landscape (GPU + TPU + FPGA + Startups) | by Jonathan Hui | Medium](https://images.openai.com/static-rsc-4/-yOd7xZRJw92OSptgsVPllzXBga4gueYdHyIrX71AQXtNo5bix-ID1fOupzd9YpOFNTeH-ZbpqbWsEx1Orb_pV9AUyAG5u3zZYQEFywb8VH3vEe-Gyuo9CpX2wzDmn7qyaegztHUg6eGjZvKkRuCtBJcHUsOeHnPUCseRGmGvo8?purpose=inline)

A Domain-Specific Supercomputer for Training Deep Neural Networks (2020)

Understand the transition from an inference accelerator to a distributed training system.

[Read the paper](https://gwern.net/doc/ai/scaling/hardware/2020-jouppi.pdf?utm_source=chatgpt.com)

[TPU v4: An Optically Reconfigurable Supercomputer for Accelerating Machine Learning](https://images.openai.com/static-rsc-4/AuO-q8FVwRtlG2s0uTa6vvlGPixcs_qnRdbxKdviaNpjqqCgXDoEpsW3g9O2BePcRq6lZdW5esYH1kzD-8cVvPPRcQHXHuREjsIhchsXmEq_zR27hw-WertM2pw_TVQTQddRMHqWA3dbjhUlPjOCErUjArdW34WOjyFk6QwAcx8?purpose=inline)

TPU v4: An Optically Reconfigurable Supercomputer for Machine Learning with Hardware Support for Embeddings (2023)

The culmination of this historical investigation.

[Read the paper](https://arxiv.org/abs/2304.01433?utm_source=chatgpt.com)

# 14. How I would approach studying this as a computer architect

I would avoid studying these machines as isolated products.

Instead, study them through the architectural problems they attempted to solve.

Here is a progression that connects the historical material to actual hardware design.

## Suggested research progression

1. Arithmetic specialization

   Study MAC units, floating-point execution, fixed-point arithmetic, quantization and numerical representations.

   Deliverable: Design a simple MAC datapath and compare fixed-point and floating-point implementations.
2. Vector and spatial architectures

   Study SIMD, vector registers, systolic arrays, dataflow and pipelining.

   Deliverable: Model a small systolic matrix multiplication architecture.
3. Memory architecture

   Study scratchpads, cache hierarchies, DMA, HBM, data reuse and memory-level parallelism.

   Deliverable: Construct a roofline model and estimate the effect of data reuse.
4. Parallel processing

   Study GPU execution models, heterogeneous processors, SIMD/SIMT, synchronization and distributed memory.

   Deliverable: Compare the communication requirements of data-parallel and model-parallel workloads.
5. Domain-specific architecture

   Study DianNao, Eyeriss, TPU v1 and numerical optimization for neural networks.

   Deliverable: Develop an accelerator design around a defined computational workload.
6. Interconnect and supercomputer design

   Study torus networks, bisection bandwidth, collective operations, optical circuit switching and topology-aware scheduling.

   Deliverable: Model a distributed accelerator system as a graph and compare different topologies.
7. Compiler and runtime integration

   Study how computational graphs map onto heterogeneous execution resources and distributed memory.

   Deliverable: Define an intermediate representation for computation, memory movement and inter-device communication.

## 15. The most important historical conclusion

There is a pattern that runs through virtually every generation of hardware accelerators.

## The evolution of the optimization target

EARLY SPECIALIZED PROCESSORS

How can we execute a particular arithmetic operation faster?

VECTOR AND SIMD MACHINES

How can we execute the same operation over large datasets?

SYSTOLIC ARRAYS AND DSPs

How can we keep computation pipelines full while reducing data movement?

GPUs AND HETEROGENEOUS SYSTEMS

How can we exploit massive parallelism without losing programmability?

NEURAL-NETWORK ASICs

How can we organize computation, memory and numerical precision around a specific workload?

TPU v4

How can we coordinate computation, memory, communication, physical topology and reliability across an entire supercomputer?

The final transition is particularly important.

TPU v4 represents a point at which accelerator architecture can no longer be understood solely by examining the processor's internal datapath.

The network, memory system, runtime, compiler, physical deployment and failure-management mechanisms are all part of the effective architecture.

And that is perhaps the most valuable lesson from this history: the evolution of hardware accelerators is fundamentally the history of moving the boundary of specialization outward—from arithmetic units, to processors, to heterogeneous systems, and finally to entire computing infrastructures.

If you follow that progression, TPU v4 becomes much easier to understand, and so do the architectural decisions behind the next generation of specialized computing systems.
