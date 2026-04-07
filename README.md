<div align="center">
  <img src="assets/images/LewisGlyph_logo_inverted.svg" alt="LewisGlyph Logo" width="120"/>

  # LewisGlyph

  ![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
</div>

<br>

LewisGlyph is a purely client-side web app that generates and decodes a custom, square-based typography system. 

## The concept

The whole idea, including the name, comes from Lewis structures in chemistry. 

If you remember high school chemistry, Lewis structures are those little diagrams where you write the chemical symbol of an element and surround it with dots to represent its electrons. I basically took that concept and applied it to the English alphabet. 

Instead of chemical elements, this project encodes letters. Every character gets translated into a square base surrounded by dots placed in specific coordinates (there are 12 possible spots). The specific arrangement of these dots, and sometimes the color of the square itself, tells you exactly what letter it is. It's like atomic numbers, but for typography.

## What it does

* **Generator:** Type regular text and watch it turn into LewisGlyph characters.
* **Layout options:** You can adjust the spacing to make the glyphs compact, normal, or spacious.
* **Export:** Save your generated text as scalable vector graphics (.svg) or normal images (.png).
* **The Translator:** This is a built-in reverse-engineering tool. You can upload any LewisGlyph SVG file, and the app will read the dots and translate it back into readable English text.
* **Completely offline:** No servers or APIs are involved. Everything runs right in your browser.

## File structure

Nothing too complicated, just a standard web dev layout:

```text
LewisGlyph/
├── index.html             # The main generator (Text to SVG/PNG)
├── translator.html        # The decoder tool (SVG to Text)
└── assets/
    ├── css/
    │   └── style.css      # Styling and layout
    ├── js/
    │   └── app.js         # Core logic for drawing the SVGs
    └── images/
        ├── LewisGlyph_logo.svg
        └── LewisGlyph_logored.svg
```

## Running the project

You don't need npm, node, or any build tools to run this.

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/LewisGlyph.git
   ```
2. Open the folder.
3. Just double-click `index.html` to open it in your browser.

## How the translator actually works

If you are curious about the logic inside `translator.html`, here is how it decodes the images:

1. It parses the uploaded SVG file as XML.
2. It looks at the square base to check its color (this helps the script tell the difference between letters that share the same dot pattern, like a red 'Y' vs a black 'V').
3. It grabs the coordinates of all the dots and maps them against a predefined 12-position grid.
4. It turns those positions into a numeric signature (like `0,2,7`), checks it against a reverse dictionary in the code, and spits out the original character.

## Contributing

This is an open-source project. If you have an idea to make it better, find a bug, or want to add a feature, feel free to fork the repository and open a pull request.

## License

This project is distributed under the MIT License. You can do whatever you want with it.

## Author

Developed by [Karrar Nazim](https://karrarnazim.space).