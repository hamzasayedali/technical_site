---
title: "ESP32 Bluetooth Audio Receiver"
slug: esp32-bluetooth-audio
date: 2026-07-04
description: "Learning how to use an ESP32 and output audio."
thumbnail: in_the_wild.png
---

<img src="/images/esp32-bluetooth-audio/in_the_wild.png" alt="Diagram" width="400">

I want to build a DIY low-latency wireless monitoring system for live music performances. At my last concert there were a few songs where I lost sync with the backing track and would have benefited from In-Ear-Monitors.  

These systems can get pretty pricey and I thought would be a good DIY electronics project to see if I could recreate the functionality I want without paying for fancy professional gear. After some research I decided to use the ESP32 platform. 

<img src="/images/esp32-bluetooth-audio/esp32.png" alt="Diagram" width="400">

The first thing I wanted to verify was outputting audio from the chip. I found a tutorial (https://www.makerguides.com/playing-audio-with-esp32-and-pcm5102/) for a simple bluetooth receiver. I got a PCM5102 Digital-to-Analog Converter (DAC) board to use provide audio functionality to the ESP32 using the Inter-Integrated-Circuit Sound (I2S) protocol.

<img src="/images/esp32-bluetooth-audio/PCM5102_board.png" alt="Diagram" width="400">

I followed the wiring guide in the tutorial and flashed the sample code. When the device is powered on, it advertises itself as a bluetooth audio device. I was able to connect to it with my phone and play music on the headphones connected to the audio jack on the PCM5102 board.

<img src="/images/esp32-bluetooth-audio/esp32_bluetooth_audio.png" alt="Diagram" width="400">

I wasn't sure if this would work because the PCM5102 board only outputs audio at "line level". This means that the signal power is meant for transfering audio from device to device rather than amplifying it on headphones. Typically, an audio output that is driving a set of headphones would be amplified to "headphone level". My headphones still output the sound clearly, but it was a lot quieter than usual. In the next iteration I will connect the output to an amplifier. I ordered the MAX4410 headphone amplifier board and will test with it next time:

<img src="/images/esp32-bluetooth-audio/MAX4410_headphone.png" alt="Diagram" width="400">