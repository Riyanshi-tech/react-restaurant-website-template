import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, default: 'ForestHub' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    gstin: { type: String, default: '' },
    gstPercent: { type: Number, default: 5, min: 0, max: 100 },
    cgstPercent: { type: Number, default: 2.5, min: 0, max: 100 },
    sgstPercent: { type: Number, default: 2.5, min: 0, max: 100 },
    whatsappCountryCode: { type: String, default: '91' },
    billFooter: { type: String, default: 'Thank you for dining with us!' }
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;

export const DEFAULT_BILLING = {
  restaurantName: 'ForestHub',
  address: '',
  phone: '',
  gstin: '',
  gstPercent: 5,
  cgstPercent: 2.5,
  sgstPercent: 2.5,
  whatsappCountryCode: '91',
  billFooter: 'Thank you for dining with us!'
};

export async function getOrCreateSettings() {
  let doc = await Settings.findOne();
  if (!doc) {
    doc = await Settings.create({});
  }
  return doc;
}
