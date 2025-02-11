# Color Mixer

A powerful color mixing tool that allows you to adjust HSB values and create beautiful color combinations with background blur effects.

## Features

- Real-time color mixing and adjustment
- HSB (Hue, Saturation, Brightness) manipulation
- Background blur effects
- Dark mode support
- Copy hex values with one click
- Background image support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vpinyokool/colorMixer.git
cd colorMixer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

To run the development server:
```bash
npm run dev
# or
yarn dev
```
This will start the development server with hot reload at `http://localhost:1234`.

### Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

### Other Commands

- Clean the build cache and dist folder:
```bash
npm run clean
# or
yarn clean
```

## Deployment to Netlify

### Method 1: Continuous Deployment (Recommended)

1. Push your repository to GitHub
2. Log in to Netlify
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 14 (or higher)
6. Click "Deploy site"

### Method 2: Manual Deployment

1. Install Netlify CLI:
```bash
npm install netlify-cli -g
```

2. Build your project:
```bash
npm run build
```

3. Deploy to Netlify:
```bash
netlify deploy
```

4. Follow the prompts to:
   - Create a new site
   - Select the `dist` folder as your publish directory
   - Preview the deployment

5. When ready, deploy to production:
```bash
netlify deploy --prod
```

## Environment Variables

No environment variables are required for basic functionality.

## Project Structure

```
colorMixer/
├── src/
│   ├── index.html
│   ├── styles.scss
│   └── js/
│       └── colorMixer.js
├── dist/           # Build output
├── package.json
└── README.md
```

## Built With

- HTML5
- SCSS
- jQuery
- Parcel Bundler

## License

This project is licensed under the MIT License - see the LICENSE file for details.
