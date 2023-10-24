# Game Engine Performance Tests

This project includes implementations of a basic custom game engine project in multiple languages, for the purpose of testing general performance while also getting a feel for how the languages actually are to work with day-to-day in a real project. The languages selected for this test are:

- C++
- Rust
- Golang
- Zig

> Note! A TypeScript implementation is also included as it is my day-to-day working language, and was my way of coming up with a general idea for engine patterns; so I could code them in comfort and finalize my ideas before moving on to the other languages.

Each implementation aims to include the following:

- SDL for managing low-level hardware input, windows, etc.
- DearIMGUI for tooling, debugging, and profiling UI
- Hot-module reloading (If possible with the language)
- FPS Counter
- Benchmarking run-mode that stress tests the engine for 5 minutes
- A configurable scene including multiple objects that emit particles
- An entity management system

## Why?

Making games is fun. But the actual underlying engines are also super interesting to me (and many others); and while I could use Unity,  Unreal, or Godot for my personal projects I would like to explore creating my own foundation to build custom projects from. For example, I personally feel that:

- **Unity** - I do not feel comfortable developing a project in Unity anymore, despite it being my engine of choice for 6+ years.
- **Unreal** - I do like a lot about Unreal, however I feel like it is far too heavy-handed for my projects, and I dislike how _heavy_ general use of the engine feels; I also feel like documentation is very hit-or-miss and end up having quite subpar experiences.
- **Godot** - I like what Godot is doing a lot; but the last time I tried it I ran into a lot of little things here and there that I really did not like. I also had a lot of issues with C# and C++ support, which I am sure are fixed now, but it still makes me somewhat cautious. That said, out of this list if this goes to hell I will likely be giving Godot another go.

Additionally, while there are undoubtably many writeups and videos around that talk about this topic, I feel that none of them really give a good insight into _real-world performance_, and _day to day feeling of the languages_. Most hyperfocus on a specific subtopic, or just talk about things anecdotally, and I primarily want to focus on the following questions:

- Which language is the fastest given a real-world scenario?
- Which language is the most comfortable/enjoyable to use day-to-day?

