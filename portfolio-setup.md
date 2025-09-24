# Why Portfolio Images Aren't Showing

## The Problem

Your website is trying to load images from the following paths:
- `portfolio/airport/main.jpg`
- `portfolio/amping/main.jpg`
- `portfolio/marahuyo/main.jpg`
- `portfolio/marikina/main.jpg`
- `portfolio/subdivision/main.jpg`

But these files don't exist in your project folder structure yet. The code has fallback placeholders from placehold.co, which is why you see gray boxes with text instead of broken images.

## How to Fix It

1. **Create the correct folder structure**:
   ```
   c:\Users\USER\Documents\NEW WEB\portfolio\
   ├── airport\
   ├── amping\
   ├── marahuyo\
   ├── marikina\
   └── subdivision\
   ```

2. **Add your project images**:
   - Place a main thumbnail image named `main.jpg` in each project folder
   - Add additional project images named `image1.jpg`, `image2.jpg`, etc.

3. **Check image paths**:
   Make sure your HTML is pointing to the correct paths (which it currently is)

4. **Alternative approach**:
   If you'd prefer to use existing images with different names/locations, you can modify the project paths in the HTML instead.

## Example

If you have an image at `c:\Users\USER\Documents\NEW WEB\images\project1.jpg` that you want to use for the Airport project:

1. Either move and rename it to `c:\Users\USER\Documents\NEW WEB\portfolio\airport\main.jpg`

2. OR update the image path in the HTML:
   ```html
   <img src="images/project1.jpg" alt="Airport Architecture">
   ```
