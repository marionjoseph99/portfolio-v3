# Architecture Portfolio Website - Image Guide

## Fixing Image Loading Issues

If you're seeing 404 errors for images, follow these troubleshooting steps:

### 1. Check Image Directory Structure

Ensure your images are in the correct folder structure:
```
c:\Users\USER\Documents\NEW WEB\
├── index.html
├── styles.css
├── script.js
└── images/
    ├── project1.jpg
    ├── project2.jpg
    ├── project3.jpg
    ├── project4.jpg
    ├── hero-architecture.jpg
    └── architect-photo.jpg
```

### 2. Check Image Filenames

Make sure your image files match exactly the filenames in the HTML, including case sensitivity:
- project1.jpg (not Project1.jpg or project1.jpeg)
- project2.jpg
- project3.jpg
- project4.jpg

### 3. Try Alternative Formats

If your images are in a different format, update the HTML accordingly:
```html
<!-- If you have PNG files instead of JPG -->
<img src="images/project1.png" alt="Modern Residence">
```

### 4. Move Images to Root Directory

If issues persist, try moving the images to the same folder as your HTML file:
```html
<img src="project1.jpg" alt="Modern Residence">
```

### 5. Using External Placeholders

The current code includes fallbacks to external placeholder images if your local images fail to load. These will show until you fix the local image paths.

## Image Optimization Tips

For best website performance:
- Keep images under 300KB each
- Use appropriate dimensions (around 1200×800px for large images)
- Use modern formats like WebP for better compression
- Consider using a tool like ImageOptim or TinyPNG to optimize your images

# Architecture Portfolio Website

## Portfolio Structure Guide

This website is designed to display your architectural works organized in a specific folder structure:

```
c:\Users\USER\Documents\NEW WEB\
├── index.html
├── styles.css
├── script.js
└── portfolio/
    ├── project-one/
    │   ├── main.jpg       # Thumbnail image (required)
    │   ├── image1.jpg     # Additional project images
    │   ├── image2.jpg
    │   └── project.json   # Project metadata (required)
    ├── project-two/
    │   ├── main.jpg
    │   ├── image1.jpg
    │   └── project.json
    └── ... more projects ...
```

### Project Metadata (project.json)

Each project folder should contain a `project.json` file with the following structure:

```json
{
    "title": "Modern Residence",
    "category": "residential",
    "year": "2023",
    "description": "A sustainable family home with clean lines and modern aesthetics, designed to maximize natural light and energy efficiency.",
    "location": "Los Angeles, CA",
    "area": "4,500 sq ft",
    "client": "Private Client",
    "featured": true
}
```

### Categories

Use one of these categories in your project.json files:
- residential
- commercial  
- public

### Image Requirements

- **Thumbnail Image**: Name it `main.jpg` - this will be used as the project thumbnail
- **Gallery Images**: Include as many additional images as needed
- **Resolution**: Images should be 1200-1600px on their longest side for optimal display
- **Format**: JPG is preferred for best performance
- **Optimization**: Compress your images for web before adding them

## Updating Your Portfolio

To add or modify projects:

1. Create a new folder in the `portfolio` directory
2. Add your project images
3. Create a `project.json` file with the project details
4. The website will automatically include your new project

## Additional Notes

- Mark your best projects with `"featured": true` to give them more prominence
- For best performance, keep your image file sizes under 300KB
- Use consistent image aspect ratios for a more uniform portfolio grid
