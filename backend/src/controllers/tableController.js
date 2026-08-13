import Table from '../models/tableModel.js';
import QRCode from 'qrcode';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { createTableSchema, updateTableSchema } from '../validators/tableValidator.js';
import { getAppBaseUrl } from '../utils/appUrl.js';

const generateSlug = (tableNumber) => {
  const pad = String(tableNumber).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 7);
  return `foresthub-t${pad}-${rand}`;
};

/**
 * @desc    Get all tables
 * @route   GET /api/tables
 * @access  Private (tables.read)
 */
export const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    return sendSuccess(res, 'Tables retrieved successfully', { tables });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single table by ID
 * @route   GET /api/tables/:id
 * @access  Private (tables.read)
 */
export const getTableById = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }
    return sendSuccess(res, 'Table retrieved successfully', { table });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new table
 * @route   POST /api/tables
 * @access  Private (tables.create)
 */
export const createTable = async (req, res, next) => {
  try {
    const validatedData = createTableSchema.parse(req.body);

    // Check if table number already exists
    const existingTable = await Table.findOne({ tableNumber: validatedData.tableNumber });
    if (existingTable) {
      throw new ApiError(400, `Table number ${validatedData.tableNumber} already exists`);
    }

    // Generate unique slug
    let slug = generateSlug(validatedData.tableNumber);
    let slugExists = await Table.findOne({ slug });
    while (slugExists) {
      slug = generateSlug(validatedData.tableNumber);
      slugExists = await Table.findOne({ slug });
    }

    // QR encodes live admin domain (Origin) else FRONTEND_URL
    const orderingUrl = `${getAppBaseUrl(req)}/orders/${slug}`;
    const qrCodeUrl = await QRCode.toDataURL(orderingUrl);

    const table = await Table.create({
      ...validatedData,
      slug,
      qrCodeUrl,
      status: validatedData.status || 'AVAILABLE'
    });

    return sendSuccess(res, 'Table created successfully', { table }, 201);
  } catch (error) {
    if (error.name === 'ZodError') {
      return next(new ApiError(400, error.errors[0].message));
    }
    next(error);
  }
};

/**
 * @desc    Update a table
 * @route   PUT /api/tables/:id
 * @access  Private (tables.update)
 */
export const updateTable = async (req, res, next) => {
  try {
    const validatedData = updateTableSchema.parse(req.body);

    const table = await Table.findById(req.params.id);
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    // If changing table number, verify uniqueness
    if (validatedData.tableNumber && validatedData.tableNumber !== table.tableNumber) {
      const existingTable = await Table.findOne({ tableNumber: validatedData.tableNumber });
      if (existingTable) {
        throw new ApiError(400, `Table number ${validatedData.tableNumber} already exists`);
      }
    }

    // Update fields
    Object.keys(validatedData).forEach((key) => {
      if (validatedData[key] !== undefined) {
        table[key] = validatedData[key];
      }
    });

    await table.save();
    return sendSuccess(res, 'Table updated successfully', { table });
  } catch (error) {
    if (error.name === 'ZodError') {
      return next(new ApiError(400, error.errors[0].message));
    }
    next(error);
  }
};

/**
 * @desc    Delete a table
 * @route   DELETE /api/tables/:id
 * @access  Private (tables.delete)
 */
export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    // Block deletion of occupied tables
    if (table.status === 'OCCUPIED' || table.activeOrder) {
      throw new ApiError(400, 'Cannot delete a table with an active order session');
    }

    await Table.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Table deleted successfully', null);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Regenerate QR Code & Slug for a table
 * @route   POST /api/tables/:id/regenerate-qr
 * @access  Private (tables.qr.generate)
 */
export const regenerateTableQr = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    // Generate a fresh unique slug
    let slug = generateSlug(table.tableNumber);
    let slugExists = await Table.findOne({ slug });
    while (slugExists) {
      slug = generateSlug(table.tableNumber);
      slugExists = await Table.findOne({ slug });
    }

    const orderingUrl = `${getAppBaseUrl(req)}/orders/${slug}`;
    const qrCodeUrl = await QRCode.toDataURL(orderingUrl);

    table.slug = slug;
    table.qrCodeUrl = qrCodeUrl;
    await table.save();

    return sendSuccess(res, 'Table QR code regenerated successfully', { table });
  } catch (error) {
    next(error);
  }
};
