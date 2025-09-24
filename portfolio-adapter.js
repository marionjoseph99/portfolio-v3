/**
 * Portfolio Adapter
 * 
 * This script helps adapt your folder structure into a format that works with the portfolio website.
 * Place this file in the same directory as your portfolio folder.
 */

// Instructions for use:
// 1. Organize your portfolio folder with each project in its own subfolder
// 2. Each project folder should have:
//    - A main.jpg file (used as thumbnail)
//    - Additional images for the project gallery
//    - A project.json file with metadata (see template below)
//
// Example project.json structure:
/*
{
    "title": "Project Name",
    "category": "residential", // residential, commercial, public
    "year": "2023",
    "description": "Project description goes here...",
    "location": "City, Country",
    "area": "5,000 sq ft",
    "client": "Client Name",
    "featured": true // set to true to make this project larger in the grid
}
*/

// In a server environment, this would scan your portfolio folder structure
// For a static site, you'll need to manually create a projects.json file
// based on your folder structure

// Example manual usage:
document.addEventListener('DOMContentLoaded', function() {
    // Set up your portfolio projects manually if you can't use server-side code
    // This would replace the fetchPortfolioProjects() function in script.js
    
    const projects = [
        {
            id: 'project-folder-name',
            title: 'Project Title',
            category: 'residential',
            year: '2023',
            description: 'Project description...',
            location: 'Location',
            area: 'Area in sq ft',
            client: 'Client Name',
            featured: true,
            thumbnailImage: 'portfolio/project-folder-name/main.jpg',
            images: [
                'portfolio/project-folder-name/main.jpg',
                'portfolio/project-folder-name/image1.jpg',
                'portfolio/project-folder-name/image2.jpg'
                // Add all image paths here
            ]
        },
        // Add more projects following the same structure
    ];
    
    // To use these projects, store them in localStorage or a global variable
    // that the main script can access
    window.portfolioProjects = projects;
});
