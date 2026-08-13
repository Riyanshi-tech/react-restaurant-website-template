import Settings, { getOrCreateSettings, DEFAULT_BILLING } from '../models/settingsModel.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { getAppBaseUrl } from '../utils/appUrl.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';

const billingShape = (doc) => ({
  restaurantName: doc.restaurantName,
  address: doc.address,
  phone: doc.phone,
  gstin: doc.gstin,
  gstPercent: doc.gstPercent,
  cgstPercent: doc.cgstPercent,
  sgstPercent: doc.sgstPercent,
  whatsappCountryCode: doc.whatsappCountryCode,
  billFooter: doc.billFooter
});

/**
 * @desc    Full settings (admin)
 * @route   GET /api/settings
 */
export const getSettings = async (req, res, next) => {
  try {
    const doc = await getOrCreateSettings();
    return sendSuccess(res, 'Settings retrieved', {
      ...billingShape(doc),
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
      resolvedBaseUrl: getAppBaseUrl(req),
      cloudinaryConfigured: isCloudinaryConfigured(),
      port: process.env.PORT || 5001,
      nodeEnv: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Billing fields for any staff (WhatsApp bill)
 * @route   GET /api/settings/billing
 */
export const getBillingSettings = async (req, res, next) => {
  try {
    const doc = await getOrCreateSettings();
    return sendSuccess(res, 'Billing settings retrieved', billingShape(doc));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update billing / restaurant settings
 * @route   PUT /api/settings
 */
export const updateSettings = async (req, res, next) => {
  try {
    const doc = await getOrCreateSettings();
    const fields = [
      'restaurantName',
      'address',
      'phone',
      'gstin',
      'gstPercent',
      'cgstPercent',
      'sgstPercent',
      'whatsappCountryCode',
      'billFooter'
    ];

    for (const key of fields) {
      if (req.body[key] !== undefined) {
        doc[key] = req.body[key];
      }
    }

    if (doc.gstPercent < 0 || doc.gstPercent > 100) {
      throw new ApiError(400, 'GST percent must be 0–100');
    }

    await doc.save();
    return sendSuccess(res, 'Settings updated', billingShape(doc));
  } catch (error) {
    next(error);
  }
};

export { DEFAULT_BILLING };
