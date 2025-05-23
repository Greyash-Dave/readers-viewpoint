# Reader’s Viewpoint

## Overview
Reader’s Viewpoint is a modern ePub reader designed to provide a personalized and customizable reading experience. Built using React.js, JavaScript, and CSS, this application allows users to read ePub files with customizable themes, font sizes, text colors, and background colors. The project also integrates YouTube video playback and background images for an enriched multimedia experience.

## Features
### Customizable Reading Experience:
- Adjustable font size.
- Customizable text and background colors.
- Themes to personalize the reading interface.

### ePub File Support:
- Load and read ePub files seamlessly.
- Navigate through sections/chapters of the book.

### Multimedia Integration:
- Embed and control YouTube videos within the reader.
- Display background images for an immersive experience.

### Keyboard Navigation:
- Use `A` and `D` keys to navigate between sections.

### Responsive Design:
- Optimized for various screen sizes and devices.

## Technologies Used
- **React.js**: For building the user interface and managing state.
- **JavaScript**: For logic and interactivity.
- **CSS**: For styling and layout.
- **ePub.js**: A JavaScript library for rendering ePub files in the browser.
- **Vite**: For fast development and building the project.

## Key Concepts and Implementation
### 1. State Management with Context API
The `EPUBContext` is created using React's `createContext` to manage global state for the ePub reader.

State variables include:
- `book`: The current ePub book.
- `currentSection`: The currently displayed section.
- `sections`: The table of contents (TOC) of the book.
- `fontSize`, `textColor`, `backgroundColor`: Customizable styles.
- `youtubeUrl`, `BGImage`: Multimedia integration.

The `EPUBProvider` component wraps the application to provide state to all child components.

### 2. ePub Rendering
- The **ePub.js** library is used to render ePub files.
- The `Reader` component initializes the ePub book and renders it into a `div` using the `renderTo` method.
- Navigation through sections is handled by the `displaySection` function.

### 3. Customizable Styles
- Users can adjust font size, text color, and background color.
- Styles are applied dynamically using the `themes.default` method provided by **ePub.js**.

### 4. Keyboard Navigation
- Event listeners detect key presses (`A` and `D`) for navigating between sections.
- The `goToNextSection` and `goToPreviousSection` functions handle section navigation.

### 5. YouTube Integration
- Users can input a YouTube URL, which is converted into an embeddable `iframe`.
- The video can be played or paused programmatically using the **YouTube IFrame API**.

### 6. Background Image
- Users can set a background image for the reader.
- The image can be hidden or displayed based on user preference.

## Project Structure
```
Reader’s Viewpoint/
├── public/
│   ├── hamburger.png
│   ├── logo.png
│   ├── x.png
├── src/
│   ├── components/
│   │   ├── Controls.css
│   │   ├── Controls.jsx
│   │   ├── EPUBContext.jsx
│   │   ├── EpubReader.css
│   │   ├── EpubReader.jsx
│   │   ├── Reader.css
│   │   ├── Reader.jsx
│   │   ├── Reader2.jsx
│   │   ├── Sidebar.css
│   │   ├── Sidebar.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
```

## How to Run the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/readers-viewpoint.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Future Enhancements
- Add support for bookmarks and annotations.
- Implement a dark/light mode toggle.
- Integrate a library for managing multiple ePub files.
- Add support for text-to-speech functionality.

## Acknowledgments
- **ePub.js** for providing the core ePub rendering functionality.
- **React.js** and the open-source community for their invaluable resources and tools.

Enjoy reading with **Reader’s Viewpoint**! 📚✨

