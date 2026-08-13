import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import MenuItem from '../models/menuItemModel.js';
import connectDB from './db.js';
import cloudinary, { isCloudinaryConfigured } from './cloudinary.js';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const img = (name) =>
  path.resolve(__dirname, '../../../frontend/src/assets/images', name);

const upload = async (filePath, publicId) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'foresthub/menu',
    public_id: publicId,
    overwrite: true
  });
  return result.secure_url;
};

const seedMenu = async () => {
  try {
    await connectDB();
    if (!isCloudinaryConfigured()) {
      throw new Error('Cloudinary not configured in .env');
    }

    console.log('Uploading images to Cloudinary...');
    const steak = await upload(img('dish-steak.webp'), 'dish-steak');
    const coffee = await upload(img('dish-coffee.webp'), 'dish-coffee');
    const story = await upload(img('our-story.webp'), 'our-story');
    const ambience = await upload(img('ambience-1.webp'), 'ambience-1');
    const jungle = await upload(img('jungle-hero.webp'), 'jungle-hero');
    const hero = await upload(img('hero-bg.webp'), 'hero-bg');
    const chef1 = await upload(img('chef-1.webp'), 'chef-1');
    const chef2 = await upload(img('chef-2.webp'), 'chef-2');
    const chef3 = await upload(img('chef-3.webp'), 'chef-3');

    const items = [
      {
        name: 'Wild Chanterelle Frittata',
        price: 320,
        category: 'breakfast',
        description: 'Forest hen eggs with wild chanterelles, fontina, and sage.',
        tag: 'Staff Choice',
        image: story
      },
      {
        name: 'Forest Honey Oats Parfait',
        price: 220,
        category: 'breakfast',
        description: 'Sheep yogurt, wild honey, toasted oats, pine-berry jam.',
        image: coffee
      },
      {
        name: 'Smoked Venison Flatbread',
        price: 480,
        category: 'lunch',
        description: 'Wood-fired flatbread, cured venison, forest onion, huckleberry.',
        tag: 'Signature',
        image: steak
      },
      {
        name: 'Rainforest Botanist Salad',
        price: 280,
        category: 'lunch',
        description: 'Moss greens, micro-herbs, walnuts, pine-needle vinaigrette.',
        image: ambience
      },
      {
        name: 'Cedar-Planked Stream Trout',
        price: 650,
        category: 'dinner',
        description: 'Local trout on cedar, wild ramp purée, blistered tomatoes.',
        tag: 'Recommended',
        image: jungle
      },
      {
        name: 'Pine-Crusted Rack of Lamb',
        price: 890,
        category: 'dinner',
        description: 'Grass-fed lamb, pine-nut crust, parsnip, bone-marrow broth.',
        image: steak
      },
      {
        name: 'Wild Blackberry Lavender Tart',
        price: 240,
        category: 'desserts',
        description: 'Sweet crust, blackberries, mountain lavender, spun sugar.',
        tag: 'Delicate',
        image: story
      },
      {
        name: 'Spruce-Infused Chocolate Mousse',
        price: 210,
        category: 'desserts',
        description: 'Peruvian chocolate with young spruce oil, wood-bowl serve.',
        image: coffee
      },
      {
        name: 'Smoked Botanical Gin & Tonic',
        price: 380,
        category: 'drinks',
        description: 'Forest gin, pine, juniper, elderflower, cedar smoke.',
        tag: 'House Special',
        image: hero
      },
      {
        name: 'Geisha Pour-Over Coffee',
        price: 180,
        category: 'drinks',
        description: 'Single-origin Geisha — jasmine, peach, citrus honey notes.',
        image: coffee
      },
      {
        name: 'Chef’s Foraged Mushroom Toast',
        price: 350,
        category: 'lunch',
        description: 'Sourdough, wild mushrooms, brown butter, herbs.',
        image: chef1
      },
      {
        name: 'Ember-Roasted Root Bowl',
        price: 420,
        category: 'dinner',
        description: 'Seasonal roots, herb oil, toasted seeds, soft egg.',
        image: chef2
      },
      {
        name: 'Moss Garden Mocktail',
        price: 260,
        category: 'drinks',
        description: 'Cucumber, lime, basil, sparkling tonic, edible flowers.',
        image: chef3
      }
    ];

    console.log('Replacing menu items...');
    await MenuItem.deleteMany();
    for (const item of items) {
      const created = await MenuItem.create(item);
      console.log(`Created: ${created.name}`);
    }

    console.log(`Done. ${items.length} menu items with Cloudinary images.`);
    process.exit(0);
  } catch (error) {
    console.error('Menu seed failed:', error);
    process.exit(1);
  }
};

seedMenu();
