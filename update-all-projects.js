/**
 * Helper script to update all projects with the correct image paths
 * Run this in your browser console to immediately update all project images
 */
document.addEventListener('DOMContentLoaded', function() {
    // Define the correct image paths for each project
    const projectImagePaths = {
        'airport': 'portfolio/airport/1.jpg',
        'amping': 'portfolio/amping/1.jpg',
        'marahuyo': 'portfolio/marahuyo/1.jpg',
        'marikina': 'portfolio/marikina/1.jpg',
        'subdivision': 'portfolio/subdivision/1.jpg'
    };
    
    // Update all project thumbnails
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        const projectId = item.getAttribute('data-project');
        if (projectId && projectImagePaths[projectId]) {
            const img = item.querySelector('img');
            if (img) {
                img.src = projectImagePaths[projectId];
                console.log(`Updated image for ${projectId}`);
            }
        }
    });
    
    console.log('All project images have been updated!');
});

// To run this manually:
// 1. Open your browser console (F12)
// 2. Copy and paste the code inside the DOMContentLoaded event
// 3. Press Enter to execute
