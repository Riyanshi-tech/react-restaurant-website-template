import MenuItem from '../models/menuItemModel.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menuValidator.js';

export const getMenuItems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    return sendSuccess(res, 'Menu items retrieved', { items });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Menu item not found');
    return sendSuccess(res, 'Menu item retrieved', { item });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const data = createMenuItemSchema.parse(req.body);
    if (data.tag === '') delete data.tag;
    if (data.image === '') delete data.image;
    const item = await MenuItem.create(data);
    return sendSuccess(res, 'Menu item created', { item }, 201);
  } catch (error) {
    if (error.name === 'ZodError') {
      return next(new ApiError(400, error.errors[0].message));
    }
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const data = updateMenuItemSchema.parse(req.body);
    const item = await MenuItem.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Menu item not found');

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        item[key] = data[key] === '' ? undefined : data[key];
      }
    });

    await item.save();
    return sendSuccess(res, 'Menu item updated', { item });
  } catch (error) {
    if (error.name === 'ZodError') {
      return next(new ApiError(400, error.errors[0].message));
    }
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Menu item not found');
    await MenuItem.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Menu item deleted', null);
  } catch (error) {
    next(error);
  }
};

export const uploadMenuImage = async (req, res, next) => {
  try {
    if (!isCloudinaryConfigured()) {
      throw new ApiError(500, 'Cloudinary is not configured');
    }
    if (!req.file) {
      throw new ApiError(400, 'Image file is required');
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'foresthub/menu' },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    return sendSuccess(res, 'Image uploaded', {
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    next(error);
  }
};
