---
title: "Down Memory Lane: TPUv4 paper"
description: "A peek into the history of the design of hardware accelerators through the lens of the TPU"
date:
tags: ["Hardware design"]
author: "Reginald Ojunga"
---

# TPU v4: An Optically Reconfigurable Supercomputer for Machine Learning with Hardware Support for Embeddings

Norman P. Jouppi et al. · Google · ISCA 2023 · Industrial Product Track · DOI: 10.1145/3579371.3589350

Production deployment

Computer architecture

Supercomputing

Primary paper: [Read the paper on arXiv](https://arxiv.org/abs/2304.01433?utm_source=chatgpt.com) · [ACM publication](https://doi.org/10.1145/3579371.3589350?utm_source=chatgpt.com).

This is an unusually important computer architecture paper because it challenges a rather persistent way of thinking about high-performance computing: that building a faster supercomputer primarily means building faster processors and connecting them with increasingly sophisticated networks.

Google's TPU v4 demonstrates something more interesting.

A supercomputer's performance depends on the coordinated design of:

1. Processing elements.
2. Memory hierarchies.
3. Interconnect topology.
4. Communication protocols.
5. Data placement and movement.
6. Workload scheduling.
7. Fault tolerance.
8. Compilers and programming models.
9. Power delivery and cooling.
10. Datacenter infrastructure.

The paper brings these concerns together into one production system.

Its most consequential contributions are:

- Optically reconfigurable interconnects: the physical connectivity of a supercomputer can be changed to match its workload.
- SparseCore: a dedicated dataflow architecture for memory-intensive embedding operations.
- Topology-aware workload optimization: neural-network parallelism, chip topology and model configuration are optimized together.
- Failure-aware supercomputing: the network can route around unavailable hardware rather than requiring every component to remain operational.
- System-level energy optimization: processor efficiency is evaluated alongside interconnects, datacenter cooling and electricity sources.

There is also an important historical distinction: optical circuit switching and torus networks were not invented by TPU v4. Google's earlier datacenter network research and decades of HPC research had explored these ideas. TPU v4's contribution was demonstrating their integration into a large, commercially deployed ML supercomputer.

Let's dissect the architecture.

# 1. Understanding the machine before understanding the paper

[从芯片到集群的光连接：Google TPU光互连的架构演进、链路优化与低延迟突破-腾讯云开发者社区-腾讯云](https://images.openai.com/static-rsc-4/quwiVw-Gs4xiqQIMBaA5kJVYtEnf9QWbc8Lvaabxf66t5kjit51qmf-8rnhuqdbzkR7NlxV0r-kiyiAW1UfXZra-bSpA43GSCx_YpNJFtiWW0jXxy36ybc69lZCh-x9-jqTumNp8rrDt-v3NGJLeJ5dVrzhU4r6c4GF2q-92JEs?purpose=inline)

[cloud.tencent.com](https://cloud.tencent.com/developer/article/2582360?utm_source=chatgpt.com)

TPU v4 is Google's fifth generation of its Tensor Processing Unit architecture and its third supercomputer designed for ML training.

It was deployed beginning in 2020. The paper was published in 2023.

The supercomputer consists of 4,096 TPU v4 chips.

Here are some of its important architectural characteristics.

| Component             | TPU v4 characteristics   |
| --------------------- | ------------------------ |
| Manufacturing process | 7 nm                     |
| Transistors           | Approximately 22 billion |
| Peak compute          | 275 TFLOPS BF16 or INT8  |
| TensorCores           | 2 per chip               |
| MXUs                  | 8 per chip               |
| HBM2 capacity         | 32 GiB                   |
| HBM bandwidth         | 1,200 GB/s               |
| On-chip common memory | 128 MiB                  |
| Vector memory         | 16 MiB per TensorCore    |
| SparseCores           | 4 per chip               |
| Interconnect          | 3D mesh/torus            |
| Maximum system size   | 4,096 chips              |

The chip itself is only one component of the design. The optical switching infrastructure is what allows these chips to become a reconfigurable supercomputer.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

## 1.1 The architectural hierarchy

It helps to think about TPU v4 in five levels.

## TPU v4 architectural hierarchy

Level 5 — Datacenter

Power, cooling, physical deployment, energy efficiency

Level 4 — Supercomputer fabric

4,096 chips · Optical circuit switches · 3D torus

Level 3 — TPU package

ASIC · HBM stacks · Package interconnect

Level 2 — Processing architecture

TensorCores · SparseCores · SRAM · DMA

Level 1 — Execution units

MXUs · Vector ALUs · Specialized embedding units

The interesting thing is that the paper does not treat these levels independently.

For example, the choice of a network topology affects how embedding tables should be partitioned. That partitioning affects memory traffic, which affects how much work should be assigned to SparseCores.

This is architectural co-design rather than isolated component optimization.

# 2. Processor architecture: TensorCores and SparseCores

The first major architectural distinction is between dense and sparse computation.

This distinction is fundamental to understanding why TPU v4 has two different processing architectures.

## 2.1 TensorCore: dense numerical computation

[如何理解 TPU | 如何扩展您的模型](https://images.openai.com/static-rsc-4/WxRM56T8ffRt1_9HfOaA7e5OSN0E6UvEEoASsa68Vq3u4HXToxW_jgHuLBMDUJkBfXCFnRKeuPa9BAwKKR5ieBcpUfo741oQoNEAt_wPS3ZXMuJ0mW3hxOjWa65ETED4fuFUM9vm7c2BiGOD0yehyvfhb5qt9Hxm3FPTUILaw-4?purpose=inline)

[skindhu.github.io](https://skindhu.github.io/How-To-Scale-Your-Model-CN/article-trans/tpus.html?utm_source=chatgpt.com)

Each TPU v4 chip contains two TensorCores.

Each TensorCore contains:

- Four 128 × 128 Matrix Multiply Units (MXUs).
- A Vector Processing Unit (VPU) with 128 lanes.
- Sixteen ALUs per VPU lane.
- 16 MiB of Vector Memory.

The MXU is the primary computational engine for dense matrix operations.

Consider:

\\[ C = A \times B \\]

For neural networks, this is central to:

- Fully connected layers.
- Attention projections.
- Matrix multiplications in Transformers.
- Many convolution operations after appropriate transformation.

A 128 × 128 matrix multiplication engine allows substantial reuse of operands.

Instead of repeatedly fetching individual values from external memory, the hardware performs many multiply-accumulate operations using the same input values.

This improves arithmetic intensity.

Recall the roofline model:

\\[ P = \min(P\_{\text{peak}}, B\_{\text{memory}}\times I) \\]

Where:

- \\(P\\) is achievable performance.
- \\(P\_{\text{peak}}\\) is peak computational throughput.
- \\(B\_{\text{memory}}\\) is memory bandwidth.
- \\(I\\) is operational intensity.

A matrix multiplication unit is designed to increase the amount of computation performed per fetched byte.

This is particularly effective for Transformer workloads.

## 2.2 Why a TensorCore is insufficient

Here is where the paper becomes interesting.

Not every neural-network operation is a matrix multiplication.

Consider a recommendation model.

It receives categorical information such as:

- User identifiers.
- Product identifiers.
- Geographic categories.
- Advertisements.
- Previously interacted-with items.

These categorical values are converted into dense numerical representations using embedding tables.

A lookup might conceptually look like:

\\[ v = E[i] \\]

Where \\(E\\) is an embedding table and \\(i\\) is an index.

Unlike matrix multiplication, this operation involves irregular memory access.

The processor cannot assume that the next memory location will be adjacent to the previous one.

Furthermore, an example may require multiple embedding lookups followed by aggregation.

This produces:

- Irregular memory accesses.
- Variable-length inputs.
- Low arithmetic intensity.
- Scatter/gather operations.
- Unpredictable communication patterns.

A powerful matrix multiplication engine is not necessarily good at this.

This is a classic example of the difference between computational throughput and useful application throughput.

## 2.3 SparseCore: a separate execution architecture

[Google TPU v4 には、TensorCoreだけでなく、SparseCoreというものが入っている - Vengineerの妄想](https://images.openai.com/static-rsc-4/5130X4d6SshTi9_e6Xif6NBy0fhI7IeZiUhwyMlyMSkrkl-y4QCKCd_0djY3if_esodx_tNE5IgDyVuZaWF4uQGDP3qq0CqtMTsOBgbqf0qYc_q8IuDh9C_Tlt_6TufS1o3x4lzT3-ykT6G9ggdOvBPqNaBDR6brgjHE_zpgLJg?purpose=inline)

[vengineer.hatenablog.com](https://vengineer.hatenablog.com/entry/2023/04/09/090000?utm_source=chatgpt.com)

SparseCore is a specialized dataflow processor designed for embedding workloads.

An important detail: SparseCore is not an entirely new idea introduced in TPU v4. Google had included it in TPU v2, subsequently improving it across generations. This paper provides a detailed architectural disclosure of its implementation.

Each TPU v4 chip contains four SparseCores.

A SparseCore contains:

- 16 compute tiles.
- Fetch units.
- Programmable 8-wide SIMD vector processing units.
- Flush units.
- Five cross-channel units.
- Sparse Vector Memory (Spmem).

Each compute tile has an associated HBM channel and supports multiple outstanding memory requests.

The execution flow is approximately:

## SparseCore dataflow

HBM

Embedding parameters and activations

Fetch units

Gather data into local Sparse Vector Memory

16 compute tiles

SIMD execution and embedding operations

Cross-channel units

Operations across the 16 Spmem banks

Flush units

Write updated parameters back to HBM

There is an interesting architectural choice here.

The SparseCore uses CISC-like instructions operating on variable-length inputs.

This is a departure from the simpler fixed-width execution model associated with conventional vector instructions.

The reason is that embedding operations frequently have data-dependent execution requirements.

For example, an embedding lookup may retrieve a variable number of vectors. The hardware benefits from instructions that express higher-level operations instead of requiring the processor to orchestrate every small operation independently.

The paper reports that SparseCore accelerates embedding workloads by approximately 5–7× while consuming around 5% of die area and power.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

The architectural lesson: specialization does not necessarily mean building another large general-purpose processor. Sometimes a relatively small, purpose-built execution engine removes a disproportionately expensive bottleneck.

This is an important principle in domain-specific architecture.

# 3. Memory architecture: the real bottleneck behind embeddings

The memory system deserves particular attention because it explains why SparseCore exists.

The TPU v4 package includes four HBM stacks.

[1.7 times faster than the A100 system, Google says TPUv4 can better meet the needs of generative AI - iMedia](https://images.openai.com/static-rsc-4/x3IHi19XVuWaRzi0k6vDgiolyKU5isnQO4WJv2vH_WoXLbTojxLiAz6fBKV3wjTCxni3VytwK8pvndDUx862Jqi-6egGW5S8c8CS8HIbKu59ckj_QBMvd-PgaJwkqZLX9rLIxxj7bWjCjb2LxYV1ZG7RM-uTQWCYBPB6OHtSVME?purpose=inline)

[min.news](https://min.news/en/tech/42bc2580056d8b1b32728e5eaf831c04.html?utm_source=chatgpt.com)

Its important memory resources include:

| Memory           | Capacity                 | Purpose                        |
| ---------------- | ------------------------ | ------------------------------ |
| HBM2             | 32 GiB                   | External high-bandwidth memory |
| CMEM             | 128 MiB                  | Shared on-chip memory          |
| TensorCore VMEM  | 16 MiB each              | Local vector memory            |
| SparseCore Spmem | 2.5 MiB per compute tile | Local sparse-data storage      |

The distinction between these memories matters.

## 3.1 HBM: capacity and bandwidth

HBM provides 1.2 TB/s of bandwidth per chip.

However, high bandwidth alone does not solve irregular access patterns.

Consider two workloads.

Workload A: dense matrix multiplication

```
Read large contiguous matrices
        |
        v
Reuse operands extensively
        |
        v
Perform many arithmetic operations
```

Workload B: embedding lookup

```
Receive categorical indices
        |
        v
Fetch scattered memory locations
        |
        v
Aggregate variable-length vectors
        |
        v
Exchange results across chips
```

The second workload is substantially harder to optimize through conventional dense compute hardware.

The memory hierarchy has to accommodate irregular accesses, outstanding requests and data movement across the interconnect.

## 3.2 CMEM: reducing pressure on external memory

One of the less obvious contributions of TPU v4 is its 128 MiB Common Memory.

It is a shared on-chip scratchpad memory.

The paper reports that increasing on-chip SRAM from 32 MiB to 160 MiB through CMEM contributes approximately:

- 1.18× performance improvement.
- 1.24× performance-per-watt improvement.

The reason is that more intermediate data can be retained locally, reducing transfers to HBM.

This illustrates a familiar architectural principle:

The fastest memory access is often the one you eliminate.

The larger memory hierarchy also demonstrates why evaluating an accelerator solely by its FLOPS is insufficient.

## 3.3 Distributed memory and the logical shared address space

Here is another particularly interesting aspect.

The TPU v4 supercomputer contains 128 TiB of aggregate HBM.

The paper describes a logically shared address space across physical chips.

But this does not mean every processor has conventional cache-coherent access to every other processor's memory.

Software explicitly controls access and movement of data.

Remote memory is accessed through asynchronous DMA writes.

This distinction is important:

| Conventional shared-memory intuition                     | TPU v4 model                                                |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| Processors access shared memory through loads and stores | Software explicitly manages data movement                   |
| Cache coherence may maintain consistency                 | No general cache-coherent shared-memory model               |
| Remote access can resemble local access semantically     | Remote access uses explicit asynchronous communication      |
| Fine-grained synchronization is central                  | Bulk data movement and communication scheduling are central |

The paper notes that each chip can maintain tens of thousands of outstanding memory requests.

This is an important design decision for hiding latency in a distributed memory system.

It also has historical connections to earlier supercomputers such as the Cray T3E, which supported logically shared address spaces with a different remote-memory access model.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+3

Why this matters to computer architecture: TPU v4 shows that memory architecture is not confined to cache hierarchies inside a processor. At sufficiently large scales, the interconnect and distributed memory programming model become part of the memory architecture itself.

# 4. Interconnect architecture: the most consequential contribution

This is arguably the most important section of the paper.

The authors recognized that increasing the number of processors does not automatically increase the performance of a supercomputer.

At some point, communication becomes the limiting factor.

To understand why, we need to examine the evolution of the TPU interconnect.

## 4.1 From 2D torus to 3D torus

TPU v3 used a 2D torus topology.

TPU v4 uses a 3D mesh that can be configured as a 3D torus.

[\[Read Paper\] A Domain-Specific Supercomputer for Training Deep Neural Networks | SingularityKChen](https://images.openai.com/static-rsc-4/QXgQMKNA5_D3SW0RyusEA7Ptrt7wb707ZosaMFC0R23JH0edd8X18LX7SAI_xOY_AQsUyaOMCrYiGyM3tCjiBliH4m6dSisVz7eGTSs3isPLSGbQLS-gkYBOI9b_XNtQC3N0Xsnl790eS_h9BUdfbTsJ2Crh-UTkgLD3_I1F7aM?purpose=inline)

2D torus

Nodes connect to their neighbors in two dimensions, with wraparound connections.

[Tearing Apart Google’s TPU 3.0 AI Coprocessor](https://images.openai.com/static-rsc-4/vltxUCAZj6UovnSoSLvbCwtEGCABCIep00CuQtavS4VzP8BsVmU2DaR7B5N-NGtwlRVETl5Wt5fRyVdmOG7DhVRcjKkFGhFrUmETBBmXXgVQ2e8eSYzcsMa0Mw3nTZa6Z_pHU1UNxEwmusFyLzMR0w9xDWuGlsUqGE3E2LXYPtY?purpose=inline)

3D torus

Nodes connect in three dimensions, improving network bisection bandwidth.

A mesh connects neighboring nodes along each dimension.

A torus adds wraparound links between opposite ends of each dimension.

For a simple illustration, consider an \\(N \times N \times N\\) system.

In a 2D torus, the bisection bandwidth scales approximately as:

\\[ B\_{2D} \propto N^{1/2} \\]

In a 3D torus:

\\[ B\_{3D} \propto N^{2/3} \\]

Here, \\(N\\) represents the total number of nodes.

Bisection bandwidth measures the communication capacity across a cut dividing a network into two approximately equal portions.

Why is this important?

Imagine splitting a supercomputer into two groups. If a workload requires substantial communication between these groups, the bandwidth available across that division constrains its performance.

A network can have extremely high aggregate bandwidth while still suffering from poor bisection bandwidth.

This is one reason why network topology matters.

## 4.2 All-reduce versus all-to-all

The paper makes a distinction that deserves careful attention.

There are two important communication patterns in distributed ML.

All-reduce

[All-Reduce and Reduce-Scatter - ML Performance](https://images.openai.com/static-rsc-4/KCTQXfXfgYDpFxnD7Dj_uuK9CoRYvrmrGgiJxSl2s1iRrnM3AwPd116-wi4xnwZyqV5QiQitXurMpkSPjM_imzB6r0eMSKrd1ePU7_vhjbB5MsxdXzG5XbfqjWxhJ9quwZZWKlbSShkxGKTS-bdx5-nEaHAQqWS4zMdzJApI41Q?purpose=inline)

[sakex.github.io](https://sakex.github.io/ml-perf/distributed/all_reduce.html?utm_source=chatgpt.com)

Every participating processor contributes data, and all processors receive the reduced result.

Common in data-parallel training, particularly gradient aggregation.

All-to-all

[NCCL Collective Communication Pattern Basics | by TUGRUL ACIKGOZ | Medium](https://images.openai.com/static-rsc-4/PxOEdqyddv2SOQuhckrY1Nqv0zD4G_0W2kIVL3ywC-p9nxcChxtsxm4WvQ9MUFLnGUQWn5dr8vzHiVA2BZaPdAK8Od2Men0rZG2yXyMfLdESC3g2PFuFEcx7_M8yHEsYVlKkhfzdawcJgaPuccZ95Totw8AU10UXnLdueG2aCUM?purpose=inline)

[medium.com](https://medium.com/%40tugrul_acikgoz/nccl-collective-communication-pattern-basics-4efe3c7e6190?utm_source=chatgpt.com)

Every processor exchanges data with multiple other processors.

Important in embedding sharding and other distributed workloads involving irregular data redistribution.

These communication patterns place different demands on the network.

All-reduce performance is strongly influenced by injection bandwidth and the efficiency of collective communication algorithms.

All-to-all communication can place much greater pressure on bisection bandwidth.

This is particularly important for recommendation systems.

Suppose an embedding table is distributed across 64 chips.

A training example may require embedding vectors stored on many different chips.

The system must retrieve those vectors, exchange them between participating chips and aggregate the results.

Consequently, a processor's ability to perform embedding lookups is tied to the communication capabilities of the entire supercomputer.

The paper identifies this as a reason for moving from the 2D torus to the 3D torus.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

# 5. Optical Circuit Switching: changing the physical network

Major architectural contribution

[谷歌 TPU v4 与光路交换 — AI System](https://images.openai.com/static-rsc-4/NjnXEeRgRC5SQVIXUZctSDFtW1X-rzOycl0Nlp6OCyZkrTfHjirH30Aiox6QbwryVh1QagZsfNIAHsciYxFiMyBaJFyZ1OiywTW-_dfWoCaQY41u5t71inYNHsgeIHysBfzlM2-DODcGqURIvfvgBoKCD7PURMRUZVN2hOwRpJo?purpose=inline)

[infrasys-ai.github.io](https://infrasys-ai.github.io/aisystem-docs/02Hardware05Abroad/08TPU4.html?utm_source=chatgpt.com)

This is the defining innovation of TPU v4.

Traditional HPC networks generally have a relatively fixed physical topology.

Even if routing tables can change, the physical links and switch hierarchy remain largely predetermined.

Google introduced Optical Circuit Switches (OCSes) to make the physical connectivity between TPU groups reconfigurable.

The OCS acts somewhat like an electronically controlled optical patch panel.

Instead of sending packets through a conventional electronic packet switch, it establishes optical paths between input and output fibers.

## 5.1 How the optical switch works

Google's Palomar OCS uses three-dimensional MEMS mirrors.

MEMS stands for Micro-Electro-Mechanical Systems.

These tiny mechanical mirrors change their orientation to redirect light from one optical fiber to another.

The paper reports switching times in milliseconds.

[The evolution of Google’s Jupiter data center network | Google Cloud Blog](https://images.openai.com/static-rsc-4/BZflQg0FGTVDTV7QUT2kM0Ya71LYTNGLlnRhAgd-Jwd5REDup5uXsE7RgDSNGgjqyWSweH_GYir3Z56ezajAjV63pFtkpTjMxZpW3qEVSneCe2Uv_ofJHz29HMnCv4G5CdbsuiZgN2CcamWyPMbRJQi96moimJAQx1v1CAGGCPc?purpose=inline)

[cloud.google.com](https://cloud.google.com/blog/topics/systems/the-evolution-of-googles-jupiter-data-center-network?utm_source=chatgpt.com)

An important distinction:

The OCS does not perform conventional packet forwarding.

It establishes circuit-level connections.

For example:

```
TPU group A ---- optical fiber ---- TPU group B
```

A connection is configured before the workload uses it.

The switch does not inspect individual packets and independently decide where each packet should go.

The optical circuit establishes a path through which the endpoint communication hardware can transmit data.

This is a different networking abstraction from Ethernet or InfiniBand packet switching.

## 5.2 The physical construction

The system uses 64 blocks of 64 TPU chips each.

That gives:

\\[ 64 \times 64 = 4096 \text{ TPU chips} \\]

Each 64-chip block is organized as a 4 × 4 × 4 cube.

Each cube has six faces.

Each face exposes 16 optical links.

Therefore:

\\[ 6 \times 16 = 96 \\]

There are 96 optical links per cube.

Because opposing faces must be connected to support wraparound, these links form 48 input-output pairs.

The system uses 48 Palomar OCS units.

Each OCS has 136 ports:

- 128 functional ports.
- 8 additional ports for testing and repair.

The resulting infrastructure connects the 64 cubes into a 4,096-chip supercomputer.

This is an impressive piece of system engineering because the optical layer sits between physically constructed blocks without requiring all the final interconnections to be permanently cabled.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+1

## 5.3 Why not just use InfiniBand?

This is an important question because InfiniBand already provides high-performance interconnects for HPC.

The paper argues that replacing TPU v4's integrated interconnect and optical switching with InfiniBand would have consequences beyond raw communication speed.

The authors identify several disadvantages:

1. Higher infrastructure cost.
2. Greater power consumption.
3. Reduced communication performance in their evaluated configurations.
4. Loss of physical topology reconfiguration.
5. Reduced ability to route around failed components.
6. More complicated deployment and utilization management.

The paper estimates that OCS infrastructure and optical components account for less than 5% of system capital cost and less than 3% of system power.

The authors also compare an InfiniBand alternative using an internal event-driven simulator. Their estimated communication slowdown varies by workload and slice size, rather than representing a universal InfiniBand disadvantage.

The more important argument is that packet-network substitution would lose several operational benefits that the optical fabric provides.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

The deeper architectural insight: the physical network itself becomes a configurable resource, rather than an immutable property of the supercomputer.

# 6. Topology engineering: the network becomes workload-aware

This is where the paper makes a particularly interesting connection between computer architecture and parallel algorithms.

Different workloads benefit from different physical network arrangements.

A topology that is excellent for one type of parallelism may be suboptimal for another.

## 6.1 The three forms of parallelism

The paper identifies three major forms of distributed neural-network parallelism.

| Parallelism          | What gets distributed?                 | Communication characteristics |
| -------------------- | -------------------------------------- | ----------------------------- |
| Data parallelism     | Training examples                      | Gradient aggregation          |
| Model parallelism    | Model parameters and tensor operations | Frequent tensor exchanges     |
| Pipeline parallelism | Model layers                           | Communication between stages  |

These are not interchangeable.

For example:

- Data parallelism benefits from efficient collective reductions.
- Tensor parallelism benefits from high-bandwidth communication between participating processors.
- Pipeline parallelism benefits from efficient communication between adjacent stages.

A topology should reflect the communication structure.

## 6.2 Twisted torus

[The AI Systems Game: Are Chip-to-Chip Interconnects the Future of Inference? | by Adi Fuchs | Medium](https://images.openai.com/static-rsc-4/HH7Qudl4TFRrefHsIhnkD-_Hl15wTR-i7Pl2xNp9iykEMPOYt9nasR_GFU_FjhWP9JD3uiCA3-InvCBbLDsWAtFExekQ1DxdPxEAA5B96cjjR_MEXXjZ9dC0T1H8TXKzHcPPym45rqTaXIJNkG8FCPHvHVVZJXMmtb39bHwPUfM?purpose=inline)

[medium.com](https://medium.com/%40adi.fu7/the-ai-systems-game-are-chip-to-chip-interconnects-the-future-of-inference-ec3bbda53eb3?utm_source=chatgpt.com)

One of the paper's particularly interesting contributions is its production use of twisted torus topologies.

A conventional rectangular torus connects nodes through regular wraparound links.

A twisted torus modifies some of those wraparound connections.

This changes network paths and improves certain communication properties, particularly worst-case bisection bandwidth and latency.

The paper uses a topology from earlier research by Camarero, Martinez and Beivide.

For two evaluated configurations, the authors report:

| Configuration | Improvement in all-to-all throughput |
| ------------- | ------------------------------------ |
| 4 × 4 × 8     | 1.63×                                |
| 4 × 8 × 8     | 1.31×                                |

These are measured improvements over their corresponding regular torus configurations.

The important point is that they achieve these improvements by changing optical connections rather than physically recabling the machine.

This is a substantial operational advantage.

## 6.3 Topology is now a scheduling decision

Imagine that a user requests 512 TPU chips.

The scheduler can allocate them in different geometries:

- 4 × 4 × 32
- 4 × 8 × 16
- 8 × 8 × 8

All three configurations contain:

\\[ 512 \text{ chips} \\]

But they do not have equivalent communication characteristics.

A workload dominated by pipeline parallelism may benefit from a long, narrow geometry.

A workload dominated by tensor parallelism may benefit from a more compact geometry.

A workload dominated by embedding exchanges may prefer greater bisection bandwidth.

The authors demonstrate that topology and parallelism configuration can substantially change end-to-end performance.

In one LLM example, configuration search improves throughput by 2.3× over the initial configuration.

For GPT-3 pretraining, the improvement over an expert-designed configuration is 1.2×.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

This leads to a very important conclusion:

The scheduler is no longer simply deciding which processors execute a job. It is deciding what physical computer the job should execute on.

That is a much more sophisticated resource-allocation problem.

# 7. Reliability engineering: designing for partial failure

This section connects TPU v4 to an important HPC problem.

Traditional supercomputing workloads frequently assume that the entire allocated system must remain available.

A large training job can run for days or weeks.

If one component becomes unavailable, the consequences can be disproportionately expensive.

The authors describe this as a challenge associated with the HPC-style checkpoint-and-restore approach.

## 7.1 Why failure probability becomes important

Consider a system containing 1,000 hosts.

Even if each host is individually reliable, the probability that every host remains available throughout a long period becomes increasingly problematic as the system grows.

If each host has availability \\(A\\), and failures are independent, the probability of all \\(n\\) hosts being available at a particular instant is:

\\[ P(\text{all available}) = A^n \\]

For example, at 99.9% individual availability:

\\[ 0.999^{1000} \approx 0.368 \\]

This is an illustrative probability calculation, not a measured TPU v4 availability result. Real systems have correlated failures, maintenance events and varying repair times.

Nevertheless, it explains the problem.

## 7.2 OCS as a reliability mechanism

Google uses the optical fabric to route around unavailable hardware.

Instead of treating the entire machine as one fixed arrangement, the system can select available blocks and construct a valid topology from them.

This gives it several advantages:

- Failed hosts can be excluded.
- Spare hardware can be incorporated.
- Jobs can be scheduled without requiring a perfectly healthy installation.
- The network can be reconfigured to accommodate component availability.

The paper discusses a 4,096-chip supercomputer with 1,024 CPU hosts.

The authors show that OCS-based reconfiguration significantly improves effective system utilization under host availability rates of 99.0–99.9%.

They call this effective throughput goodput.

This distinction matters.

Peak performance tells you what the system can theoretically deliver.

Goodput tells you how much useful work the system actually completes under real operational constraints.

## 7.3 Incremental deployment

Another benefit is deployment modularity.

TPU v3 required much more of the overall system to be installed and tested before the supercomputer became usable.

TPU v4 can bring individual 64-chip blocks into production independently.

The OCS fabric allows these blocks to be incorporated into larger configurations as additional hardware becomes available.

This reduces the dependency on completing an entire installation before any of it becomes useful.

## 7.4 Security and isolation

The paper also discusses using the OCS fabric to create physically isolated network configurations.

Different customer slices can be separated through optical circuit configuration.

This provides an additional isolation mechanism in a shared infrastructure.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+1

The HPC lesson: resilience should be designed into the network topology and resource-allocation system, rather than relying exclusively on software recovery after a failure.

# 8. Compiler architecture and software-hardware co-design

This is a particularly important part of the paper because it demonstrates that hardware optimization cannot stop at the processor.

The authors use machine learning to optimize the hardware configuration and the neural-network workload together.

There are two important examples.

## 8.1 Co-optimizing SparseCore and TensorCore utilization

Remember that DLRMs use both:

- SparseCore for embedding computation.
- TensorCore for dense neural-network computation.

These processors have different execution characteristics.

If one finishes its assigned work much earlier than the other, the system loses throughput.

The authors report that one production recommendation model left SparseCore idle for approximately 25% of execution time.

They address this using a technique called Parallel-Aware Neural Architecture Search (PA-NAS).

It searches for model configurations that balance the workloads between the two processor types.

The result is an improvement of more than 10% in end-to-end performance.

This is significant because the optimization is not primarily about making either processor faster.

It is about distributing work more effectively between heterogeneous processors.

## 8.2 Topology and model configuration search

The authors also use search to optimize:

- Network topology.
- Pipeline parallelism.
- Data parallelism.
- Model parallelism.
- Tensor partitioning.

The results show that expert intuition alone can leave substantial performance unused.

One LLM configuration improved by 2.3× over the initial configuration.

This suggests that the best configuration is not necessarily the most obvious one based on the model's mathematical structure.

It must also account for the actual hardware topology.

## 8.3 What does this mean for compilers?

The paper does not introduce a new compiler intermediate representation or a new compiler architecture.

However, its findings have significant implications for compiler design.

Consider the following compilation pipeline:

Neural-network graph

Operations, dependencies, tensors

Workload analysis

Dense computation, sparse computation, communication

Hardware-aware partitioning

TensorCore / SparseCore allocation

Topology-aware mapping

Chip placement, parallelism, communication planning

Execution

Kernel execution, DMA and collective communication

This raises several questions for compiler engineers:

1. Should communication topology be represented explicitly in an intermediate representation?
2. Should memory placement be part of the compiler's scheduling model?
3. Should hardware-specific execution units be represented through separate dialects or target abstractions?
4. Can an optimizer reason about the cost of remote memory access?
5. Can the compiler co-optimize computation partitioning and network topology?

These are not questions that can be adequately addressed by a conventional instruction-selection pass.

They concern the relationship between the computational graph and the distributed machine executing it.

For an MLIR-style compiler, this suggests a separation between:

- High-level computational semantics.
- Device-specific execution semantics.
- Distributed tensor partitioning.
- Communication and synchronization semantics.
- Physical topology and resource mapping.

It is particularly important not to conflate a logical tensor partition with its physical placement. Two identical logical partitions can have very different communication costs depending on where their data resides.

This is one of the strongest compiler-architecture lessons I would extract from TPU v4.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

# 9. Instruction-set architecture and execution semantics

The paper is not an ISA paper, but it exposes an important contrast between execution models.

TPU v4 has two distinct types of computational execution.

TensorCore execution

- Matrix-oriented operations.
- Regular data structures.
- Dense arithmetic.
- Highly structured operand reuse.

SparseCore execution

- CISC-like instructions.
- Variable-length input processing.
- Irregular gather/scatter operations.
- Specialized cross-channel operations.
- Data-dependent execution time.

This is interesting from an instruction-set design perspective.

A conventional SIMD instruction operates on a predetermined number of elements.

A SparseCore instruction can express a higher-level operation whose amount of work depends on the data.

This introduces a different balance between:

- Instruction decoding.
- Hardware control.
- Memory access.
- Variable-length processing.
- Parallel execution.

It is an example of how an ISA should reflect the computational structure of its target workload.

The larger lesson is that a machine need not have one uniform execution model throughout its architecture.

Heterogeneous execution semantics can be useful when the workloads have fundamentally different characteristics.

# 10. Packaging and physical implementation

The TPU v4 package is another important part of the design.

[【芯片论文】谷歌TPU v4：用于机器学习的光学可重构超级计算机，具有嵌入的硬件支持 - 知乎](https://images.openai.com/static-rsc-4/N7cbtG9S6xOMldc-D7EVGYm-PGpGQubvxINY7H0I613bo8LNG4q_H8TmMi_a6_SXLkYNw9B1gvTbsUfwonCZ8c1KpK1c1UzIQ_N528HTPK4IHINlvN7lc3-y9qVSZs6bFZHpAgPW-6POKpWmmAzrrYu_wXMRREl2Nid_eWE5QWA?purpose=inline)

[zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/655892418?utm_source=chatgpt.com)

The package combines the ASIC with four HBM stacks.

Four TPU v4 packages are mounted on a printed circuit board.

The board includes:

- Four internal ICI links connecting the chips in a 2 × 2 mesh.
- Sixteen external ICI connections to other trays.
- PCIe connectors.
- OSFP optical interconnect connectors.

The system uses passive electrical cabling for connections within its 64-chip blocks, while electrical-to-optical conversion takes place at the optical fiber connections.

This is a hybrid interconnect architecture.

It does not attempt to make every connection optical.

Instead, it uses electrical connections where they are practical and optical links where the system benefits from longer-distance connectivity and reconfigurability.

This is a good illustration of physical architecture being driven by electrical engineering constraints.

## Why this matters

At large scales, interconnect design must account for:

- Signal integrity.
- Electrical reach.
- Cable losses.
- Transceiver power.
- Connector density.
- Packaging constraints.
- Thermal dissipation.
- Manufacturing cost.

The move towards optical connections is not simply about increasing bandwidth.

It is also about changing the physical limitations associated with connecting thousands of processors.

# 11. Power, thermal architecture and energy efficiency

One of the paper's strongest arguments is that accelerator performance must be evaluated at the system level.

A processor that delivers impressive FLOPS but consumes excessive power or requires substantial cooling infrastructure may be a poor supercomputing solution.

## 11.1 Process technology versus architectural improvements

TPU v4 moved from the 16 nm process used by TPU v3 to 7 nm.

Its peak computational performance increased approximately 2.2×.

However, the authors attribute only around 40% of the performance-per-watt improvement to process technology.

The remaining improvement comes from architectural and implementation decisions, including:

- Pipeline balancing.
- Clock gating.
- Improved memory architecture.
- Larger on-chip SRAM.
- Better interconnect bandwidth.
- Additional specialized execution resources.

The reported results are:

Performance over TPU v3

# 2.1×

Performance per watt

# 2.7×

The paper also reports lower average chip power for TPU v4 than TPU v3.

This is important because it shows that architectural efficiency can be as consequential as process scaling.

## 11.2 Cooling

The TPU v4 boards use liquid cooling.

This is an important physical design consideration because the system packs four high-performance accelerator packages onto a board.

At this level of density, thermal design cannot be separated from electrical and architectural design.

Cooling influences:

- Sustained operating frequency.
- Thermal throttling.
- Power density.
- Reliability.
- Datacenter energy requirements.

## 11.3 The 4Ms of ML energy efficiency

The authors discuss energy efficiency using four factors:

1. Model: the computational workload and its algorithmic efficiency.
2. Machine: processor and system performance per watt.
3. Mechanization: datacenter infrastructure efficiency, including Power Usage Effectiveness.
4. Map: the carbon intensity of the electricity supply.

This is a particularly important contribution to the way computer architects should evaluate computing infrastructure.

For example, the paper estimates that TPU v4 in Google's energy-efficient datacenters consumes substantially less energy and produces approximately 20× less operational CO2e than a contemporary accelerator system in a typical on-premise datacenter.

However, this comparison is not a pure chip-to-chip measurement.

It includes assumptions about datacenter PUE, renewable electricity procurement and the electricity carbon intensity.

The paper is making a broader infrastructure argument, not claiming that the TPU silicon alone is 20× more carbon-efficient.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

# 12. Operating-system, runtime and resource-management implications

The paper does not describe a conventional operating-system architecture in detail.

Nevertheless, the physical system it describes creates several important responsibilities for the runtime and infrastructure software.

Consider what happens when someone requests a 512-chip TPU slice.

The system needs to:

1. Find available TPU chips.
2. Determine whether they can form the requested geometry.
3. Identify available CPU hosts.
4. Configure the optical circuit switches.
5. Establish the required interconnect topology.
6. Allocate memory and other resources.
7. Expose the resulting configuration to the training software.
8. Monitor the allocated hardware and respond to failures.

This is much more than ordinary CPU scheduling.

It is closer to allocating a configurable distributed machine.

## 12.1 Resource scheduling becomes topology-aware

A conventional scheduler might ask:

> Which processors are free?

A topology-aware scheduler must also ask:

> Can the available processors be arranged into a network that efficiently supports this workload?

This introduces a graph-allocation problem.

Let the physical machine be represented as:

\\[ G_p = (V_p,E_p) \\]

Where:

- \\(V_p\\) represents available hardware nodes.
- \\(E_p\\) represents available physical communication links.

Let the application communication graph be:

\\[ G_a = (V_a,E_a) \\]

The scheduling problem now involves mapping application nodes onto physical nodes while minimizing communication costs and respecting resource constraints.

A simplified objective might be:

\\[ \min \left( \alpha C\_{\text{communication}} + \beta C\_{\text{latency}} + \gamma C\_{\text{resource fragmentation}} \right) \\]

Subject to:

- Hardware availability.
- Connectivity constraints.
- Capacity constraints.
- Required parallelism.
- Isolation requirements.

This is a useful abstraction for understanding the engineering problem, although it is not the exact scheduling objective disclosed in the paper.

## 12.2 Fault handling becomes a resource-management problem

The OCS architecture also changes how failures are handled.

A failed component need not necessarily invalidate the entire logical supercomputer.

The infrastructure can construct a new valid configuration using available resources.

This resembles fault-aware graph remapping.

The scheduler, topology manager and runtime must cooperate.

This has consequences for checkpointing, recovery and workload orchestration, even though the paper does not provide a complete implementation of those software subsystems.

# 13. Benchmarking: what did TPU v4 actually demonstrate?

The authors compare TPU v4 with TPU v3, NVIDIA A100 and Graphcore IPU.

It is important to understand the nature of these comparisons.

## 13.1 TPU v4 versus TPU v3

The paper reports:

- Approximately 2.1× overall performance improvement.
- Approximately 2.7× performance-per-watt improvement.
- Approximately 1.5–2× performance improvements for many production applications.
- Approximately 3–3.5× improvement for one production recommendation workload.

The recommendation workload benefits particularly from the additional SparseCore resources.

## 13.2 TPU v4 versus NVIDIA A100

The paper uses MLPerf Training 2.0 results.

For similar-sized systems, it reports:

| Benchmark | TPU v4 advantage    |
| --------- | ------------------- |
| BERT      | Approximately 1.15× |
| ResNet    | Approximately 1.67× |

It also reports lower average power for TPU v4 in its 64-chip measurements.

However, the comparison has limitations:

- The systems have different memory architectures.
- Their interconnects differ.
- Their processor execution models differ.
- Their benchmark configurations differ.
- The power measurements were collected in different environments.

These results should not be interpreted as proof that TPU v4 is universally faster than an A100.

They demonstrate the performance of the evaluated systems and workloads.

## 13.3 The most impressive system-level result

The paper discusses the 540-billion-parameter PaLM model.

PaLM sustained approximately 57.8% of peak hardware floating-point performance over 50 days on TPU v4 supercomputers.

This is a significant result.

Sustaining a large fraction of peak compute performance across thousands of processors for an extended training run is a much harder engineering challenge than demonstrating peak throughput in a short benchmark.

It requires:

- Effective distributed scheduling.
- Good communication efficiency.
- Memory management.
- Failure handling.
- High availability.
- Balanced compute and communication.

This is where TPU v4's architectural decisions become particularly meaningful.

[image](https://www.google.com/s2/favicons?domain=https://neuronad.com\&sz=32)

neuronad.com+2

# 14. What did TPU v4 actually change in the HPC industry?

This requires a distinction between three things:

1. Ideas that existed before TPU v4.
2. Practices that Google demonstrated in production.
3. Broader practices that the HPC and AI infrastructure industries subsequently began emphasizing.

It would be historically inaccurate to say that TPU v4 invented optical switching, torus networks, topology-aware scheduling or dataflow computing.

All existed before this paper.

Its significance is that it demonstrated how these ideas could be combined into a large production ML supercomputer.

Here are the most consequential shifts.

## 14.1 From fixed topology to reconfigurable topology

Major operational shift

Historically, many HPC installations were designed around a fixed physical network.

TPU v4 demonstrates that physical connectivity can be changed to accommodate different workloads.

The implication is that network topology becomes a runtime infrastructure resource.

This changes how architects approach:

- Network design.
- Cluster scheduling.
- Hardware deployment.
- Failure management.
- Workload placement.

A related development is Google's earlier Jupiter datacenter network research, which describes the use of OCS-based topology engineering and incremental network deployment.

This is important historical context: the TPU v4 architecture builds on an existing Google infrastructure direction rather than introducing optical circuit switching from nothing.

[image](https://www.google.com/s2/favicons?domain=https://research.google\&sz=32)

Google Research+1

## 14.2 From processor-centric to communication-centric optimization

The industry increasingly recognizes that scaling an accelerator cluster is a communication problem as much as a computational problem.

This is particularly visible in modern distributed AI workloads.

Consider the progression:

| Earlier emphasis             | Broader system-level emphasis        |
| ---------------------------- | ------------------------------------ |
| Peak FLOPS                   | Sustained application throughput     |
| Processor utilization        | End-to-end system utilization        |
| Network bandwidth            | Topology and communication patterns  |
| Fixed network design         | Workload-aware network configuration |
| Processor-level optimization | Compute-memory-network co-design     |

This is not an entirely new HPC philosophy. Traditional supercomputing has always had to deal with communication costs.

What TPU v4 demonstrates is how central these concerns become in large-scale ML systems.

## 14.3 From treating failures as exceptional to designing around them

The paper reinforces an important operational principle:

A supercomputer should not require every physical component to be available before it can deliver useful work.

This encourages a shift toward:

- Fault-aware resource allocation.
- Incremental deployment.
- Flexible partitioning.
- Redundant connectivity.
- Better effective utilization.

This is especially relevant to AI clusters because long training runs can be expensive to interrupt.

## 14.4 From FLOPS benchmarking to workload-level benchmarking

TPU v4 demonstrates why peak FLOPS is an inadequate measure of system quality.

A chip with higher peak throughput may perform worse on a workload because of:

- Memory bandwidth.
- Memory capacity.
- Communication overhead.
- Poor load balance.
- Scheduling inefficiencies.
- Power restrictions.

The roofline model is useful, but large distributed systems require additional analysis of network communication and synchronization.

The paper reinforces the importance of measuring complete training workloads.

## 14.5 From general-purpose acceleration to heterogeneous compute

SparseCore demonstrates the value of dedicated hardware for operations that do not map efficiently onto conventional matrix engines.

This has broader implications for the development of AI accelerators.

Rather than relying exclusively on increasingly large matrix multiplication arrays, architects can consider specialized execution resources for:

- Sparse computation.
- Irregular memory access.
- Data movement.
- Embedding operations.
- Reduction and aggregation.

This does not mean every operation deserves dedicated silicon.

The challenge is determining which operations are sufficiently common, expensive and stable to justify hardware specialization.

## 14.6 From hardware optimization to hardware-software co-design

The authors demonstrate that optimizing the neural-network graph, processor allocation and network topology together can produce much larger improvements than optimizing one component in isolation.

This has implications for:

- Compiler architecture.
- Distributed runtimes.
- Automatic parallelization.
- Neural architecture search.
- Hardware resource scheduling.
- Performance modeling.

The paper provides a compelling argument for treating the compiler and runtime as part of the effective computer architecture.

## 14.7 From datacenter power to computing sustainability

The 4Ms framework encourages architects to think beyond processor power consumption.

The physical location of a datacenter, its cooling infrastructure and its electricity supply all influence the environmental cost of computing.

This broadens the responsibility of computer architects.

Energy efficiency is no longer simply a matter of reducing the number of joules consumed by an individual instruction.

It is a property of the entire computing infrastructure.

# 15. Did the industry actually adopt optical switching?

There is evidence that interest in optical switching for AI and HPC infrastructure has continued beyond TPU v4.

However, we should distinguish research interest, commercial development and widespread production adoption.

Two particularly useful developments illustrate this.

[Optical Circuit Switch Google at Gabrielle Woolner blog](https://images.openai.com/static-rsc-4/Pd-yvv0DGD0OYc-3ZKICDwI1CEXquiktWF-YaqNw0mat5os7pLbPr1i3Dc1tqp1sdLbVY8ebnUL8Fz2MnLwscy-Fuk_n4kHgRRxKeR5z-QLaStlylfkym7a5ewFEA7nc63u0lJU1aHcB_dhANbeSuC5KEcrmZ5COE2z8nK6Etpw?purpose=inline)

Google Jupiter Evolving — SIGCOMM 2022

Describes Google's production deployment of optical circuit switches in its datacenter network, including topology engineering, incremental capacity deployment and network operations.

[Google Research publication](https://research.google/pubs/jupiter-evolving-transforming-googles-datacenter-network-via-optical-circuit-switches-and-software-defined-networking/?utm_source=chatgpt.com)

[Optical Circuit Switches in AI Hyperscale Data Centers – The MEMS Advantage | Lumentum](https://images.openai.com/static-rsc-4/bOD3x_4pWoLHQRw8zuQ-PWnHlWLdAeI_QJlqCO2agsE_Q6L3nV8HHtN2lUnTUViqycKSHBQEB9dPYqYU3uvp4n09pmjryi8UCarLUkbP1vgP4LJn5XT6supuaOtHU547SgAZz7vMpoIjCfyQcXsW6wimgQkoyjNcHdTNAxGaU5M?purpose=inline)

Optical Switching for Data Centers and Advanced Computing Systems — 2025

An NVIDIA-authored research article examines optical circuit switching for AI/HPC clusters, including failure resilience and reconfigurable topologies.

[Journal of Optical Communications and Networking](https://opg.optica.org/jocn/abstract.cfm?uri=jocn-17-1-A87\&utm_source=chatgpt.com)

[Hybrid Packet-Optical Circuit Switch Networks are New Data Center Standard](https://images.openai.com/static-rsc-4/43tlheabgP9b0jr6Pkpfx4B0FpBJqUQv3LJscPsgFs8rB7FkBAfLns4JoiAgLHRUSd2p14XVaDgcDvn6i9VyUzBBoV-x8oyjtTz-p8n-rdmbN77KsM_L5hWK5oYPAUcM9PFFXt0sfgFJyDR1nK2moiGrYkhHML6KhWj9MhXqjUU?purpose=inline)

Open Compute Project — Optical Circuit Switching for AI, 2026

A subsequent industry white paper discusses OCS applications in AI infrastructure, including topology reconfiguration and failure recovery.

[OCP white paper](https://www.opencompute.org/documents/ocp-ocs-white-paper-april-2026-final-pdf?utm_source=chatgpt.com)

The 2025 publication is particularly interesting because it examines optical switching as a Layer-1 software-defined networking capability.

The broader idea is that programmability should extend beyond packet routing into the physical connectivity layer.

That is closely aligned with the architectural philosophy demonstrated by TPU v4.

However, these developments do not establish that all HPC vendors have adopted TPU-style OCS architectures.

# 16. Critical assessment: what the paper gets right and what it leaves unresolved

A good architecture paper should not simply convince us that its design works. We should also understand its limitations.

I would identify six important considerations.

## 16.1 Optical switching is not universally superior

OCS provides substantial benefits when connections are relatively stable over the duration of a workload.

However, it has limitations:

- Reconfiguration takes milliseconds rather than occurring at packet timescales.
- Circuit connections are one-to-one.
- The switch does not provide arbitrary packet-level routing.
- The system needs software to determine when and how to reconfigure.
- Physical optical components introduce their own reliability and maintenance requirements.

Consequently, OCS complements rather than universally replaces packet-switched networking.

## 16.2 SparseCore is specialized

SparseCore is excellent for the workloads it targets.

But specialized hardware introduces a risk: what happens when the workload changes?

The paper itself acknowledges this problem.

For example, RNNs declined substantially in Google's workload mix while Transformers and LLMs became increasingly important.

Had Google invested heavily in an RNN-specific accelerator, that hardware might have become less useful.

The authors argue that TPU v4 avoided this problem through a balance of specialization and generality.

This is an important DSA design principle.

## 16.3 The memory system is not fully transparent

The logically shared address space does not provide conventional cache-coherent shared memory.

Software must explicitly manage remote data movement.

This makes programming and optimization more demanding.

It also means that compiler and runtime support become particularly important.

## 16.4 Topology optimization introduces additional complexity

A topology that improves one communication pattern might worsen another.

Furthermore, the optimal configuration can depend on:

- Model dimensions.
- Batch size.
- Parallelism strategy.
- Memory capacity.
- Communication volume.
- Synchronization frequency.

This creates a potentially expensive optimization search space.

The paper demonstrates the benefits of configuration search but does not eliminate the underlying complexity.

## 16.5 The benchmark comparisons need careful interpretation

The paper's comparisons against A100 and Graphcore IPU are useful, but they do not establish universal hardware superiority.

The authors themselves discuss differences in memory capacity, processor architecture, system size and power measurement.

The TPU v4 results should be understood in the context of the evaluated workloads and configurations.

## 16.6 The paper is not a complete architectural specification

This is particularly important if you intend to use it as a reference for hardware implementation.

It does not provide everything required to reproduce the TPU v4:

- Complete RTL.
- Full instruction encoding.
- Detailed cache and memory-controller implementation.
- Complete network protocol specifications.
- Full scheduler implementation.
- Complete compiler implementation.
- All physical-design and verification details.

It is a production architecture retrospective, not an implementation manual.

# 17. Connecting TPU v4 to the broader evolution of computer architecture

I think the most useful way to understand this paper is to place it within several broader architectural developments.

## Architectural connections

1\. Flynn's taxonomy and heterogeneous processing

TPU v4 demonstrates the value of combining different execution models rather than relying on a uniform processor architecture.

Related concepts: SIMD, dataflow, spatial computing, domain-specific architectures.

2\. Memory-centric computing

SparseCore illustrates that data access patterns can determine the appropriate processor architecture.

Related concepts: HBM, scratchpad memories, DMA, NUMA, distributed shared memory, memory bandwidth.

3\. Network architecture and graph theory

The optical fabric demonstrates that network topology can be a dynamically configurable architectural property.

Related concepts: graph embedding, bisection bandwidth, torus networks, Dragonfly, Clos, circuit switching.

4\. Fault-tolerant distributed systems

The system treats hardware availability as a scheduling and topology problem.

Related concepts: graceful degradation, fault domains, redundancy, checkpointing, recovery.

5\. Compiler and runtime architecture

The system requires workload partitioning, topology-aware placement and communication optimization.

Related concepts: graph partitioning, tensor compilers, distributed IRs, scheduling, cost models.

6\. Physical computer architecture

Packaging, electrical reach, optics, cooling and power delivery are integral to system performance.

Related concepts: 3D integration, HBM packaging, thermal design, photonics, warehouse-scale computing.

There is also a historical connection worth investigating: the Cray T3E, ILLIAC IV and traditional massively parallel processing systems.

These machines explored several concepts that are relevant to TPU v4:

- High-bandwidth processor interconnects.
- Torus topologies.
- Distributed memory.
- Data-parallel execution.
- Large-scale communication.

TPU v4 is not a departure from the history of supercomputing. It is an evolution of several of its fundamental ideas, adapted to contemporary ML workloads.

# 18. What I would study alongside this paper

I would not recommend reading TPU v4 in isolation. Its most interesting ideas become considerably easier to understand when connected to foundational architecture literature.

Here is a reading path organized by architectural domain.

[Computer Architecture: A Quantitative Approach  6th ed.](https://images.openai.com/static-rsc-4/O--jGWSiU35uJT_LIDP9dnE2rmRUw84CgZC8gVqNXDMOE_rQLOJh3D59Rbmc6Oxkp9uTFrF_NV4Tj5wt7L5CbwhY5QlIUkxWBFalg089ASmq9MUdW_g05kWerHFVpwrfP_dUxrBtVqUiEi7Ks_epo8at9g7mBRlRZBhBmVPNkpk?purpose=inline)

1\. Computer Architecture: A Quantitative Approach

John Hennessy and David Patterson.

Essential for understanding pipelines, memory hierarchies, parallelism, interconnects, performance models and energy efficiency.

Foundational

[‎Principles and Practices of Interconnection Networks (Enhanced Edition) by William James Dally & Brian Patrick Towles on Apple Books](https://images.openai.com/static-rsc-4/grmMohjTmbx4B9_Yjeh9gBzN8v967tKmR3CsHBfaG5EBZfaDJ8A_G6Wm9deCvF4hV_q1utFjMikk0jpuR7x1KwuBlZeo2n8cUO7cey_90ne2Zkax7xzeqsUuJ_6c8GPmgKcEj0ars2yPSk3PK8LaCTQ6q2Fu1OmUWephTvxmOIA?purpose=inline)

2\. Interconnection Networks: An Engineering Approach

José Duato, Sudhakar Yalamanchili and Lionel Ni.

Particularly useful for understanding network topology, routing, flow control, deadlock and communication performance.

[PARALLEL COMPUTER ARCHITECTURE : A HARDWARE/ SOFTWARE APPROACH by CULLER DAVID E.ET.AL | Hardcover | 2009-01 | ELSEVIER INDIA | 9788181471895 | Biblio](https://images.openai.com/static-rsc-4/DhVJQtJ-P8fcM5Vd6X5AAS5j67lu-p6URERy6FME2zaH-0b-PCtxsUuMznIhtv1Qwe19fGqnss7GwjzjFEax8AWA2Dy0nkCmNZ8uB1ea4uLS59RN9nIbKe2vqgJRJ7VDCGg50Qp51jd_PalPox6B_DlUWQwK7Zv-ODHCG9z3YCs?purpose=inline)

3\. Parallel Computer Architecture: A Hardware/Software Approach

David Culler and Jaswinder Pal Singh.

Helps explain the relationship between parallel programming models, communication and hardware organization.

[The Datacenter As A Computer: Designing Warehouse-scale Machines Book By Luiz Andr Barroso,urs Holzle,parthasarathy Ranganathan, ('tp') | Indigo](https://images.openai.com/static-rsc-4/kI5i-0TNvSX9o1lK_OG0Es7NYnZISpXp8y2xtbb4RFXNX8J7WJYcgM09nAIb1Ne67otwR64oWorLYw76NrfbVzhlmJzXBc6gRBsXmz3K2tC-puJGeNaYcKgKxkgkkzTICeb55kI_cb3ad-YxohLD1TkY2pNH7MLjEVUiL1vaxYI?purpose=inline)

4\. The Datacenter as a Computer

Luiz André Barroso, Urs Hölzle and Parthasarathy Ranganathan.

Essential for understanding why the datacenter itself should be treated as a computer.

[Computer Architecture - (The Morgan Kaufmann Computer Architecture and Design) 7th Edition (Paperback) : Target](https://images.openai.com/static-rsc-4/a50bCpUsXtLE0iEvC7w5x22ntkU7aveLpZze4rpiC1mFN00o_EvKdmmTZ92_hhITXon8DuufJTXyIo3UsYUWcLmjieLwg6TjKsrKvggoj4XVrH5iW2CclL6pT8SSkN2q8aGrgnR2aNvu5WoK26lX2Dy6EYwrRugOD-BRaOBJS68?purpose=inline)

5\. Computer Architecture: A Constructive Approach

Yale Patt and Sanjay Patel.

Useful for building a deeper understanding of the relationship between hardware structures and execution.

## Papers I would particularly recommend

| Paper                                                              | Why it matters                                                                      |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| In-Datacenter Performance Analysis of a Tensor Processing Unit     | Understand the original TPU design philosophy.                                      |
| A Domain-Specific Supercomputer for Training Deep Neural Networks  | Understand the evolution from TPU v3 to TPU v4.                                     |
| Twisted Torus Topologies for Enhanced Interconnection Networks     | Understand the mathematical and architectural foundation of twisted tori.           |
| Jupiter Evolving                                                   | Understand production optical switching and topology engineering.                   |
| The Landscape of Parallel Computing Research: A View from Berkeley | Understand the broader architectural implications of parallelism and communication. |

# 19. My final architectural assessment

I would rank the paper's contributions as follows.

| Contribution                                | Architectural significance      |
| ------------------------------------------- | ------------------------------- |
| Optical circuit switching                   | Very high                       |
| Workload-aware topology reconfiguration     | Very high                       |
| SparseCore architecture                     | Very high                       |
| Distributed memory and communication design | High                            |
| Fault-aware resource management             | High                            |
| Compiler and workload co-optimization       | High                            |
| Energy-aware datacenter design              | High                            |
| Individual TensorCore improvements          | Important, but less distinctive |

The most important contribution is not the MXU, SparseCore or even the optical switch in isolation.

It is the demonstration that a supercomputer should be designed as a coordinated collection of computational, memory, communication and infrastructure resources.

I would summarize the paper's central architectural argument in three principles:

1\. Computation is not the same as performance.

A processor's theoretical throughput is irrelevant if memory access, communication or synchronization prevents it from being utilized.

2\. Physical architecture should accommodate computational structure.

The network topology, processor allocation and memory organization should reflect the communication requirements of the workload.

3\. The machine extends beyond the chip.

The scheduler, compiler, interconnect, cooling system, datacenter and electricity supply all contribute to the effective performance and cost of computation.

There is one particularly important implication for the future of computer architecture:

We should stop thinking about a supercomputer as a collection of processors connected by a network. We should increasingly think about it as a programmable computational graph whose processing resources, memory resources and physical communication paths can be jointly configured.

That is the deeper idea I would take away from TPU v4.

## 20. Questions worth investigating after reading the paper

These are the questions I would use to test whether you have understood the architecture at a deeper level.

Architecture comprehension

0/6 explored

1\. Why does a 3D torus improve embedding workloads differently from dense all-reduce workloads?

2\. Why does SparseCore exist when TensorCore already has vector processing units?

3\. Why is an OCS not simply a faster Ethernet switch?

4\. Why does a logically shared address space not imply cache-coherent shared memory?

5\. Why is topology-aware scheduling a graph-mapping problem?

6\. Why is performance per watt insufficient to measure datacenter efficiency?

My recommendation for your next architectural investigation: study the relationship between TPU v4's topology-aware execution and compiler intermediate representations. In particular, investigate how a compiler could represent distributed tensors, remote memory operations, collective communication and physical topology without coupling its high-level computational semantics to one particular interconnect.

That is where this paper becomes particularly interesting beyond ML acceleration: it exposes a much broader problem in the design of modern heterogeneous and distributed computing systems.
