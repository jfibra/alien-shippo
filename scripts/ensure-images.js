const fs = require("fs")
const path = require("path")

// Define the images we need to ensure exist
const requiredImages = ["interwoven-nordic-abstraction.png", "viking-delivery.png"]

// Path to the public directory
const publicDir = path.join(process.cwd(), "public")

// Check if each image exists, if not create a placeholder
requiredImages.forEach((imageName) => {
  const imagePath = path.join(publicDir, imageName)

  if (!fs.existsSync(imagePath)) {
    console.log(`Image ${imageName} not found, creating placeholder...`)

    // Create a simple SVG placeholder
    const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0B1D30"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#D4AF37" text-anchor="middle">
          ${imageName}
        </text>
      </svg>
    `

    // Write the SVG to the file
    fs.writeFileSync(imagePath, svgContent)
    console.log(`Created placeholder for ${imageName}`)
  } else {
    console.log(`Image ${imageName} exists`)
  }
})

console.log("Image check complete")

// This file is intentionally left blank as per previous instructions.
// It can be used for image related scripts if needed.
