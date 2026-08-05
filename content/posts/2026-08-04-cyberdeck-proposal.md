---
title: "Mini Cyberdeck Project Proposal"
date: 2026-08-04
description: "Ideation for a small-form DIY portable computer."
thumbnail: altoids_cyberdeck.png
---

Electronics projects are such a fun way to apply the engineering skills I learned during my computer engineering undergrad. I've built a couple small ones over the last year ([Bluetooth Audio Receiver](/blog/esp32-bluetooth-audio/), [Simple Analog Synth](/blog/basic-breadboard-synth/)). I wanted to start a larger project (potentially with friends) and so I needed to evaluate what I enjoyed about engineering projects:

*What makes a good engineering project?*

- **Coolness Factor** - You want a project that is epic and makes you excited to work on it.
- **Type of Work** - You want a project that mostly lines up with the areas of the tech stack that you enjoy working on (e.g. circuit design, sensor fusion, real-time operations, networking, graphics programming).
- **Difficulty Level** - You want it to be challenging enough to be fulfilling, but not too difficult that it stresses you out or makes you give up.
- **Utility** - You want to relate to the problem that your project is solving because it will help you stay motivated to see that problem actually get solved.

A versatile project I've found that can be tailored to match all 4 of those categories is a **Cyberdeck**.


<img src="/images/cyberdeck-proposal/cyberdeck_examples.png" alt="Diagram" width="600">

## What is a Cyberdeck?

A **Cyberdeck** is just a custom computer system. It is inspired by sci-fi media and fits in the cyberpunk aesthetic. Most Cyberdecks I've seen online are built around a general purpose computer (like a Raspberry Pi) and a custom form-factor (rugged cases, Altoids tins, retro game console cases), with a few special sensors or hardware components built in.

The spirit of the project is to build a computer device with a hella indie focus, picking and choosing features and components as the builder sees fit and not conforming to a predetermined feature set.

In this video, *Exercising Ingenuity* builds a custom keyboard on a prototyping [perfboard](https://en.wikipedia.org/wiki/Perfboard), wires up a small screen and USB hub to a Raspberry Pi Zero and makes a pocket-sized Cyberdeck in an Altoids tin. This is appealing because it has the Pi's GPIO pins exposed, meaning you could connect all kinds of electronic components to it and run custom programs, turning the Cyberdeck into a multipurpose sensor.

[Altoids Cyberdeck](https://www.youtube.com/watch?v=j262kCYZxZI)

{% youtube j262kCYZxZI %}

For my [Bluetooth Receiver](/blog/esp32-bluetooth-audio/) project, I bought a few ESP32 microcontrollers. These microcontrollers have the ability to directly wirelessly communicate with each other (with no internet) with a protocol called ESP-NOW.

My vision for a Cyberdeck project is to use a Raspberry Pi for the main processor, and connect up an ESP32 that can be loaded with various programs, and use the ESP-NOW protocol to send commands and communicate with other ESP32 projects (including other Cyberdecks). The Raspberry Pi runs Linux, meaning it would be easy to get running right away, and the ESP32 is very common with lots of good documentation and functionality:

<img src="/images/cyberdeck-proposal/block_diagram.png" alt="Diagram" width="600">

From this basic structure, you can add on more sensors and components. I would probably want to add a headphone jack/speaker, a camera, and some general connectors (I2C, SPI, Ethernet) to be able to connect to more hardware.

After getting the base electronics working, I would want to put it in a cool-looking case. Either something retro or futuristic (or mundanely present-day).

<img src="/images/cyberdeck-proposal/clear_case.png" alt="Diagram" width="400">

## Why this would be a good project:

**Coolness Factor**: 
Obviously this is in the eye of the beholder, but *"Cyberdeck"* is a pretty sick name for a device. Also being able to build your own custom computing device in a world of iPhones is epic because you can include features that a standard smartphone wouldn't include, e.g. a motor to jiggle your mouse while you're away from Slack.

**Type of Work**: Some areas of the tech-stack are unavoidable in this project, but it gives you a lot of freedom on *what* to work on. If you're not into programming, you can just flash an unedited Raspberry Pi operating system onto the cyberdeck and focus on adding cool hardware components. If you're less into hardware, you can just buy pre-built keyboards and screens, and focus on writing cool embedded applications for the device. If you're more into industrial design, you can fully 3D-model a case. If you aren't, you can just buy a plastic box and shove everything into it ungracefully. 

**Difficulty Level**: Similar to the Type Of Work section, the difficulty level is mostly up to you! I personally don't want to deal with any crazy circuit design, so I would probably not build any custom hardware. What is exciting for me is using the ESP-NOW protocol to communicate with other ESP32s offline. Also, using AI tools, you can totally skip any hard bugs with Claude Code.

**Utility**: I thought about doing the Cyberdeck project while I was building my [Synthesizer](/blog/basic-breadboard-synth/) project because I wanted a way to display the readings from an ESP32 GPIO pin. I can do this by connecting the ESP32 to my computer, but I thought it would be sweet to have a portable screen, sort of like a Digital Multimeter, that could show me readings without having to connect to a laptop. Using this Cyberdeck as a sort of remote controller/analyzer tool for other electronics projects is really appealing to me.

## Mini Cyberdeck Vision

Now for a second, imagine you are a friend of Hamza:

> You both build Cyberdecks together with the Raspberry Pi and ESP32 microcontroller attached. Wire up the battery, screen, keyboard. Stick it in a cool-ass box. Flash the operating system. Hamza sets up a CI/CD pipeline that builds the custom software and lets you easily write new apps and update the cyberdeck.

<img src="/images/cyberdeck-proposal/pocket_cyberdeck.png" alt="Diagram" width="400">

[Source](https://www.reddit.com/r/cyberDeck/comments/xttw20/pocket_deck/)

> You are interested in robotics, so your next project is a simple 2-axis robot arm with a gripper. You build the motors + electronics and stick an ESP32 on it to control the motors on the thingy. Then, on your Cyberdeck you write a simple program that lets you control the robot arm with your keyboard wirelessly (where otherwise, you would have to connect a laptop to the ESP32 or use some other protocol).

<img src="/images/cyberdeck-proposal/robot_arm.png" alt="Diagram" width="400">

[Source](https://www.electrondust.com/2018/11/11/esp-32-micro-robot-arm/)

> While you're working on this project, Hamza, who is more interested in software and networking, builds a Cyberdeck specific social media app that you both can install on your Cyberdecks. It lets you send Cyber-texts to each other over the internet but not using social media. It also lets you send Cyber-texts directly over the ESP-NOW protocol when you are in range of each other with no internet at all!

<img src="/images/cyberdeck-proposal/pictochat.png" alt="Diagram" width="400">

[Source](https://www.nintendoworldreport.com/preview/3689/pictochat-nintendo-ds)

> He also designs a custom Linux UI skin to make the programs on the Cyberdeck look cool and neo-futuristic. You ask him to make it Overwatch-themed. He doesn't know what this means, but he tries his best and makes the desktop of the Cyberdeck look like the Overwatch main menu.

<img src="/images/cyberdeck-proposal/overwatch.png" alt="Diagram" width="400">

> This is so fire.

## Parts That I Have/Are Shipping

CardKB Keyboard

<img src="/images/cyberdeck-proposal/cardkb.png" alt="Diagram" width="600">

3.5 Inch TFT SPI Display

<img src="/images/cyberdeck-proposal/display.png" alt="Diagram" width="600">

Raspberry Pi Zero W

<img src="/images/cyberdeck-proposal/raspi_zero.png" alt="Diagram" width="600">

ESP32

<img src="/images/cyberdeck-proposal/esp32.png" alt="Diagram" width="600">

The total cost with equipment would probably end up around ~$100, but the actual cost of all the components would be closer to $60 which is definitely not breaking the bank.

## Conclusion

I wrote this blog post because I am excited about the project idea, but it also isn't the best project for everyone. For one, it's pretty general purpose, but if you only really are excited by a specific field, robotics for example, it might be more enjoyable to just do a straight-up robotics project.

The thing I like about this project though is that it serves as an individually-satisfying project, a cool tool for future projects, and a collaborative project. The bones are the same, a Raspberry Pi, screen, and keyboard, but the ESP32, which allows for direct communication, would let you build all kinds of cool software and hardware with others.

P.S.

The screen came in today:

<img src="/images/cyberdeck-proposal/spidey.png" alt="Diagram" width="600">