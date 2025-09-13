import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImage(inputPath, filename) {
  const ext = path.extname(filename).toLowerCase();
  const nameWithoutExt = path.basename(filename, ext);
  
  try {
    // Skip if already optimized
    if (filename.includes('optimized') || filename.includes('.webp')) {
      return;
    }

    console.log(`Optimizing ${filename}...`);
    
    // Read the original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Calculate new dimensions (maintain aspect ratio, max width 1200px)
    const maxWidth = 1200;
    const maxHeight = 800;
    let { width, height } = metadata;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    // Generate WebP version
    await image
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ 
        quality: 85,
        effort: 6 
      })
      .toFile(path.join(outputDir, `${nameWithoutExt}.webp`));

    // Generate fallback JPEG/PNG
    const outputFormat = ext === '.png' ? 'png' : 'jpeg';
    const outputImage = image.resize(width, height, { 
      fit: 'inside',
      withoutEnlargement: true 
    });

    if (outputFormat === 'jpeg') {
      await outputImage
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .toFile(path.join(outputDir, `${nameWithoutExt}.jpg`));
    } else {
      await outputImage
        .png({ 
          compressionLevel: 9,
          progressive: true 
        })
        .toFile(path.join(outputDir, `${nameWithoutExt}.png`));
    }

    console.log(`✓ ${filename} optimized successfully`);
    
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error);
  }
}

async function optimizeAllImages() {
  console.log('Starting image optimization...');
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    await optimizeImage(inputPath, file);
  }
  
  console.log('Image optimization complete!');
}

optimizeAllImages().catch(console.error);