// Function to get RGB values from an Image object or URL
async function getImagePixels(input) {
    return new Promise((resolve, reject) => {
        const processImage = (img) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image and get pixel data
            ctx.drawImage(img, 0, 0);
            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                resolve(imageData.data);
            } catch (error) {
                reject(new Error('Error getting image data: ' + error.message));
            }
        };

        if (input instanceof HTMLImageElement) {
            if (input.complete) {
                processImage(input);
            } else {
                input.onload = () => processImage(input);
                input.onerror = (error) => reject(new Error('Error loading image: ' + error));
            }
        } else {
            // Assume input is URL string
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => processImage(img);
            img.onerror = (error) => reject(new Error('Error loading image: ' + error));
            img.src = input;
        }
    });
}

// Function to get color histogram from RGB pixels
function getImageColorHistogram(pixels) {
    // Initialize histogram arrays for R, G, B channels
    const histogram = [
        new Array(256).fill(0),  // R channel
        new Array(256).fill(0),  // G channel
        new Array(256).fill(0)   // B channel
    ];

    const colorCount = [0, 0, 0];  // Count for each channel

    // Process each pixel (RGB values are in groups of 4 due to RGBA format)
    for (let i = 0; i < pixels.length; i += 4) {
        // R channel
        histogram[0][pixels[i]]++;
        colorCount[0]++;

        // G channel
        histogram[1][pixels[i + 1]]++;
        colorCount[1]++;

        // B channel
        histogram[2][pixels[i + 2]]++;
        colorCount[2]++;
    }

    return { histogram, colorCount };
}

// Function to get dominant color using median calculation
async function getImageDominantColor(input) {
    try {
        const pixels = await getImagePixels(input);
        const { histogram, colorCount } = getImageColorHistogram(pixels);
        const dominantColor = [];

        // Calculate median for each channel (R, G, B)
        for (let channel = 0; channel < 3; channel++) {
            const median = Math.floor(colorCount[channel] / 2);
            let count = 0;

            // Find the color value where count exceeds median
            for (let colorValue = 0; colorValue < 256; colorValue++) {
                count += histogram[channel][colorValue];
                if (count > median) {
                    dominantColor.push(colorValue);
                    break;
                }
            }
        }

        return dominantColor;
    } catch (error) {
        console.error('Error getting dominant color:', error);
        throw error;
    }
}

// Helper function to convert RGB array to hex color
function rgbToHex(rgb) {
    return '#' + rgb.map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// Example usage:
// getImageDominantColor('https://example.com/image.jpg')
//     .then(dominantColor => {
//         console.log('Dominant RGB:', dominantColor);
//         console.log('Dominant Hex:', rgbToHex(dominantColor));
//     })
//     .catch(error => console.error(error));

export { getImageDominantColor, rgbToHex };