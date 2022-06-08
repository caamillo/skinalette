## What is Skinalette?
Skinalette is a very small project developed for a very stupid need: the palette changer for skin in [Minecraft](https://www.minecraft.net/ "Minecraft"). Think it, it is really weird that in 10+ years nobody has ever thought of a tool for this stupid, but in some cases (like mine) need. So here is my solution to this stupid problem:

I built that using some modern technologies such as: **React**, **Tailwind** and for the rendering part I used the [skinview3d](https://github.com/bs-community/skinview3d "skinview3d") package that interfaces with [Three.js](https://threejs.org/ "Three.js") library.

### How does that work?

I panicked for days because I could not find a good library for parsing pixels in the image and replacing them, but here's how I figured it out:

![](https://i.imgur.com/GyUCLl0.png)

I wrote methods for parsing images through their bitmaps.
 
### 1. Parse the bitmap
 
The first process is to get the input skin, and if it is valid ( check if the bitmap length is `64^2 * 4` ), a method for parsing the bitmap to an object of pixels list comes out. Note: this is NOT an app for replacing skin pixel colors. In fact, it will store all the initial pixel colors, and you will constantly change only them, not the newest updated ones. This is because if the app replaces the pixels by colors and not by an initial array of the stored pixels, the pixels may overlap each other. So, there is an array of initial pixels in the array for each color.
 
Example:
```
[
   { id: 0, hex: '#fff', rgb: [ 255, 255, 255, 255 ], pixels: [ 0, 1, 5, 6, 7, 9, ...N0 ] },
   { id: 1, hex: '#000', rgb: [ 0, 0, 0, 255 ], pixels: [ 2, 3, 4, 8, 10, 11, ...N1 ] }
]
```
Note that invisible pixels `rgb(0, 0, 0, 0)` around the skin are not stored for efficiency.
 
![bitmap](https://i.imgur.com/p0YFXPz.png)