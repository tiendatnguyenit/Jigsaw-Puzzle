# Adding Your Own Images

To use your own pictures in the jigsaw puzzle game, follow these steps:

## 1. Prepare Your Images
- Find 5 images you want to use for the puzzle levels
- Make sure they are in JPG format
- Recommended size: 300x300 pixels or larger (square images work best)
- Name them: `level1.jpg`, `level2.jpg`, `level3.jpg`, `level4.jpg`, `level5.jpg`

## 2. Add Images to This Folder
- Copy your 5 images into this folder (`public/images/`)
- Make sure the filenames match exactly:
  - `level1.jpg` - for Level 1
  - `level2.jpg` - for Level 2  
  - `level3.jpg` - for Level 3
  - `level4.jpg` - for Level 4
  - `level5.jpg` - for Level 5

## 3. Update Level Names (Optional)
- Open `src/data/gameLevels.ts`
- Change the `name` field for each level to describe your images
- For example: `"Level 1 - Family Photo"` or `"Level 2 - Vacation Spot"`

## 4. Test Your Images
- Run the game with `npm run dev`
- Your images should now appear in the puzzle game!

## Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: 300x300 pixels minimum (square recommended)
- **File size**: Keep under 1MB per image for best performance
- **Quality**: Clear, high-contrast images work best for puzzles

## Troubleshooting
- If images don't appear, check the browser console for errors
- Make sure filenames match exactly (case-sensitive)
- Ensure images are in the correct folder (`public/images/`)
- Try refreshing the page after adding images
