Musical source separation has become increasingly effective in recent years. As such, applications of music source separation have the potential to touch many aspects of MIR research. However, from a user’s perspective, either in doing source separation research from scratch or in applying source separation to other tasks (e.g. polyphonic music transcription), there are still significant roadblocks. Code and data are released on a paper-by-paper basis, making it difficult to compare, use and extend existing techniques. This limits the usefulness of source separation for researchers not actively steeped in its many nuances, and hinders its applicability to broader MIR research.

In this tutorial, we present a set of complementary, easy-to-use, open-source tools and datasets for source separation research, evaluation, and deployment. We show how they interlock with one another, and how they can be used in concert to structure source separation within a project for research or deployment. Finally, we propose a generic and well-tested project structure for efficiently doing modern source separation research, from sweeping over hyperparameters, to setting up competitive baselines, to augmenting your datasets.

Participants of this tutorial will leave with:

1. A practical overview of source separation including history and current research trends.
2. The ability to make educated decisions about how to best include source separation in their workflow.
3. The ability to select the proper separation algorithm or a pre-trained model for their research.
4. The ability to effectively train a custom model for their research using open-source tools.

Our tutorial is aimed at researchers and practitioners that are familiar with audio and machine learning but have little or no experience with source separation. Our primary resources will be the following open-source/data projects: [nussl](https://github.com/nussl/nussl), [scaper](https://github.com/justinsalamon/scaper), [Slakh2100](http://www.slakh.com/), and [MUSDB18](https://sigsep.github.io/datasets/musdb.html). References to additional tools and datasets (including for non-music audio) will be provided.

##### Presenters
<br>
**Ethan Manilow** is a PhD candidate in Computer Science at Northwestern University under advisor Prof. Bryan Pardo. His research lies in the intersection of signal processing and machine learning, with a focus on source separation, automatic music transcription, and open source datasets and applications. Previously he was an intern at Mitsubishi Electric Research Labs (MERL) and at Google Magenta. He is one of the lead developers of nussl, an open source audio separation library.

**Prem Seetharaman** is a research scientist at Descript in San Francisco. Previously, he was a teaching fellow at Northwestern University, where he received his PhD in 2019 advised by Bryan Pardo. The objective of his research is to create machines that can understand the auditory world. He works in computer audition, machine learning, and human computer interaction. He is one of the lead developers of nussl, an open source audio separation library, and Scaper, a library for soundscape generation & augmentation.

**Justin Salamon** is a research scientist and member of the Audio Research Group at Adobe Research in San Francisco. Previously he was a senior research scientist at the Music and Audio Research Laboratory and Center for Urban Science and Progress of New York University. His research focuses on the application of machine learning and signal processing to audio & video, with applications in machine listening, representation learning & self-supervision, music information retrieval, bioacoustics, environmental sound analysis and open-source software & data. He is the lead developer of Scaper, a library for soundscape generation & augmentation.
