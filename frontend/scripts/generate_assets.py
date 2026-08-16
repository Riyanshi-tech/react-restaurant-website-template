import os
import math
from PIL import Image, ImageEnhance, ImageFilter

downloads_dir = "/home/riyanshi/Downloads"
images_dir = "/home/riyanshi/Downloads/react-restaurant-website-template/frontend/src/assets/images"

os.makedirs(images_dir, exist_ok=True)

# Helper to apply professional enhancement: contrast, saturation, sharpness
def enhance_image(img, contrast=1.2, saturation=1.25, sharpen=True):
    # Enhance contrast
    img = ImageEnhance.Contrast(img).enhance(contrast)
    # Enhance color saturation
    img = ImageEnhance.Color(img).enhance(saturation)
    # Enhance sharpness slightly
    if sharpen:
        img = img.filter(ImageFilter.SHARPEN)
    return img

# Helper to apply a professional vignette overlay for dark, luxury feel
def apply_vignette(img, max_opacity=0.65):
    width, height = img.size
    # Create radial gradient mask
    cx, cy = width / 2.0, height / 2.0
    r_max = math.sqrt(cx**2 + cy**2)
    
    grad_size = 100
    grad = Image.new('L', (grad_size, grad_size))
    for x in range(grad_size):
        for y in range(grad_size):
            dx = x - grad_size/2.0
            dy = y - grad_size/2.0
            dist = math.sqrt(dx**2 + dy**2) / (grad_size/2.0)
            # Quadratic falloff for smooth transition
            intensity = int(min(255, max(0, (dist ** 2) * 255 * max_opacity)))
            grad.putpixel((x, y), intensity)
            
    vignette_mask = grad.resize((width, height), Image.Resampling.LANCZOS)
    vignette_color = Image.new('RGBA', (width, height), (0, 0, 0, 255))
    
    img_rgba = img.convert('RGBA')
    final_img = Image.composite(vignette_color, img_rgba, vignette_mask)
    return final_img.convert('RGB')

# 1. Hero Background (jungle-hero.webp)
# Source: WhatsApp Image 2026-08-13 at 8.36.31 PM (1).jpeg (1600x1204)
# Crop to widescreen 16:9 ratio (1600x900) centered vertically
hero_src = os.path.join(downloads_dir, "WhatsApp Image 2026-08-13 at 8.36.31 PM (1).jpeg")
if os.path.exists(hero_src):
    img = Image.open(hero_src)
    cropped = img.crop((0, 152, 1600, 1052))
    enhanced = enhance_image(cropped, contrast=1.2, saturation=1.35)
    final = apply_vignette(enhanced, max_opacity=0.7)
    final.save(os.path.join(images_dir, "jungle-hero.webp"), "WEBP", quality=90)
    print("Generated jungle-hero.webp successfully.")

# 2. Welcome / Our Story (our-story.webp)
# Source: WhatsApp Image 2026-08-13 at 8.36.28 PM (3).jpeg (1200x1600)
# Crop to portrait 4:5 ratio (1200x1500)
story_src = os.path.join(downloads_dir, "WhatsApp Image 2026-08-13 at 8.36.28 PM (3).jpeg")
if os.path.exists(story_src):
    img = Image.open(story_src)
    cropped = img.crop((0, 50, 1200, 1550))
    enhanced = enhance_image(cropped, contrast=1.15, saturation=1.2)
    enhanced.save(os.path.join(images_dir, "our-story.webp"), "WEBP", quality=90)
    print("Generated our-story.webp successfully.")

# 3. Ambience Main (ambience-1.webp)
# Source: WhatsApp Image 2026-08-13 at 8.36.31 PM (2).jpeg (1204x1600)
# Crop to 4:5 ratio (1200x1500)
amb_src = os.path.join(downloads_dir, "WhatsApp Image 2026-08-13 at 8.36.31 PM (2).jpeg")
if os.path.exists(amb_src):
    img = Image.open(amb_src)
    cropped = img.crop((2, 50, 1202, 1550))
    enhanced = enhance_image(cropped, contrast=1.15, saturation=1.25)
    enhanced.save(os.path.join(images_dir, "ambience-1.webp"), "WEBP", quality=90)
    print("Generated ambience-1.webp successfully.")

# 4. Ambience Overlapping Card (hero-bg.webp)
# Source: WhatsApp Image 2026-08-13 at 8.36.29 PM.jpeg (1200x1600)
# Crop to square focusing on gorilla wall sculpture (1200x1200)
bg_src = os.path.join(downloads_dir, "WhatsApp Image 2026-08-13 at 8.36.29 PM.jpeg")
if os.path.exists(bg_src):
    img = Image.open(bg_src)
    cropped = img.crop((0, 200, 1200, 1400))
    enhanced = enhance_image(cropped, contrast=1.2, saturation=1.25)
    enhanced.save(os.path.join(images_dir, "hero-bg.webp"), "WEBP", quality=90)
    print("Generated hero-bg.webp successfully.")

# 5. Food Assets from the high-res poster (WhatsApp Image 2026-08-13 at 8.36.30 PM.jpeg)
poster_src = os.path.join(downloads_dir, "WhatsApp Image 2026-08-13 at 8.36.30 PM.jpeg")
if os.path.exists(poster_src):
    poster = Image.open(poster_src)
    
    # 5a. Dish 1: Forest Fire Wood-Fired Pizza
    pizza_box = (120, 880, 720, 1480)
    pizza_img = poster.crop(pizza_box).resize((600, 600), Image.Resampling.LANCZOS)
    pizza_enhanced = enhance_image(pizza_img, contrast=1.15, saturation=1.2)
    pizza_enhanced.save(os.path.join(images_dir, "dish-pizza.webp"), "WEBP", quality=90)
    
    # 5b. Dish 2: Jungle King Craft Burger
    burger_box = (450, 830, 1050, 1430)
    burger_img = poster.crop(burger_box).resize((600, 600), Image.Resampling.LANCZOS)
    burger_enhanced = enhance_image(burger_img, contrast=1.15, saturation=1.2)
    burger_enhanced.save(os.path.join(images_dir, "dish-burger.webp"), "WEBP", quality=90)
    
    # 5c. Dish 3: Panda's Special Sichuan Noodles
    noodles_box = (280, 360, 880, 960)
    noodles_img = poster.crop(noodles_box).resize((600, 600), Image.Resampling.LANCZOS)
    noodles_enhanced = enhance_image(noodles_img, contrast=1.15, saturation=1.2)
    noodles_enhanced.save(os.path.join(images_dir, "dish-noodles.webp"), "WEBP", quality=90)
    
    print("Generated food assets dish-pizza.webp, dish-burger.webp, and dish-noodles.webp successfully.")
else:
    print(f"Error: High-res poster not found at {poster_src}")
