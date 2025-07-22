import fs from "fs"
import path from "path"

// List of critical images to verify
const criticalImages = ["interwoven-nordic-abstraction.png", "viking-delivery.png", "viking-freight-logo.png"]

// Path to public directory
const publicDir = path.join(process.cwd(), "public")

// Check if images exist
function verifyImages() {
  console.log("Verifying critical images...")

  let allImagesExist = true

  criticalImages.forEach((imageName) => {
    const imagePath = path.join(publicDir, imageName)
    const exists = fs.existsSync(imagePath)

    console.log(`${imageName}: ${exists ? "✅ Found" : "❌ Missing"}`)

    if (!exists) {
      allImagesExist = false
    }
  })

  if (!allImagesExist) {
    console.error("Some critical images are missing! Please ensure all required images are in the public directory.")
    process.exit(1)
  } else {
    console.log("All critical images verified successfully!")
  }
}

verifyImages()
