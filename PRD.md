# Product Requirements Document (PRD) - Sovereign Portfolio

## 1. Overview
The goal is to enhance Ram Kuhite's Sovereign Portfolio website to make it extremely premium, interactive, and functional. It is a single-page portfolio with a WebGL (Three.js) background, Lenis smooth scrolling, GSAP animations, and an interactive Console (shell).

## 2. Core Objectives & Enhancements
1. **Fully Playable Console Games & Tools**:
   - **Number Guessing Game**: Make the `guess` command fully functional. Initialize with a random number (1-100), track attempts, and guide the user dynamically with "Higher!" or "Lower!".
   - **Functional Stopwatch**: Make `watch start`, `watch stop`, and `watch reset` fully functional. Dynamically update the stopwatch elapsed time.
   - **Tic-Tac-Toe vs AI**: After the biometric handshake, allow the user to play Tic-Tac-Toe directly in the terminal by typing coordinates/numbers (e.g. `play 1-9`). Implement a basic AI opponent.
2. **Local Message Center (Inbox)**:
   - Persist contact form messages to `localStorage` in addition to Formspree submission.
   - Add a hidden terminal command `inbox` or `messages` (optionally unlocked via biometric handshake) to view received messages directly within the portfolio's interactive console.
3. **Hash-Based Deep Linking & Active Navigation**:
   - Implement client-side hash routing (`#home`, `#about`, etc.).
   - Support forward/backward browser navigation.
   - Update navigation active styles dynamically.
4. **Dynamic SEO & Title Tags**:
   - Update page title dynamically as the user scrolls or navigates to different sections (e.g., "Ram Kuhite | Projects", "Ram Kuhite | Experience").
5. **Accessibility & SEO Best Practices**:
   - Ensure semantic HTML, proper header hierarchy, image alt texts, and unique IDs on all input/button controls.

## 3. Tech Stack & Constraints
- Vanilla HTML5 / CSS3 / JavaScript
- Three.js (WebGL Background)
- GSAP & ScrollTrigger (Animations)
- Lenis (Smooth Scrolling)
- Bootstrap Icons
