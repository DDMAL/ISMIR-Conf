This tutorial will walk attendees through the use of a Python framework called klio that makes use of the Apache Beam Python SDK to parallelize the execution of audio processing algorithms over a large dataset. Apache Beam is a portable and extensible programming model that unifies distributed batch and streaming processing. It manages the I/O and parallelized execution needed for large-scale data processing. Any audio processing algorithm that can be executed by a Python process and has dependencies that can be installed on machines supported by Apache Beam runners can be run with klio. Audio processing algorithms that have been added to a klio data processing job can be run locally on the practitioner's machine, before being run on large-scale data processing systems like Google Cloud Dataflow. This enables the practitioner to make quick local changes to their algorithm and test it on a few files before deploying a longer running job on more files.

The intended audience of this tutorial are audio processing practitioners who have wrestled with the complexity of iterating upon and coordinating the execution of algorithms that both consume and produce large audio datasets. klio provides best-practice standards and abstractions, encoded in its Python-based command line interface and API, that help audio practitioners prototype, organize and scale their work.

During the tutorial, attendees will receive:

* An overview of klio that establishes core concepts and features
* Guidance through building a klio audio processing graph and running it on an audio dataset

##### Presenters
<br>
**Fallon Chen** is a Senior Engineer at Spotify, where she builds libraries and tools for audio processing. She holds a M.S. in Computer Science from the University of California, San Diego, and a B.S. in Computer Science from the University of California, Davis. Her favorite genre is industrial techno.

**Lynn Root** is a Staff Engineer at Spotify and resident FOSS evangelist. She is a seasoned speaker on building and maintaining distributed systems, and maintains Spotify's audio processing framework. Lynn is a global leader of diversity in the Python community, and the former Vice Chair of the Python Software Foundation Board of Directors. When her hands are not on a keyboard, they are usually holding a bass guitar.

**Dan Simon** is a Senior Data Engineer at Spotify, where he’s contributed to a number of efforts including music recommendations and personalized playlists, experimentation infrastructure, and audio processing frameworks.  He has a B.S. in Computer Science from Stevens Institute of Technology.

**Shireen Kheradpey** is a Machine Learning Infrastructure Engineer at Spotify where she works on audio processing tools. She holds a BS degree from Boston University where she dual majored in Biomedical Engineering and Mechanical Engineering. Currently streaming the Hamilton soundtrack on Spotify.
