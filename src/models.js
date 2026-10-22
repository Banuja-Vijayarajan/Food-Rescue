import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const userSchema = new Schema({
  role: { type: String, enum: ['donor', 'recipient', 'admin'], required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  organizationType: String, contactPerson: String, phone: String, address: String,
  city: String, district: String, regNumber: String, description: String, avatar: String,
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, default: 'Pending' },
  isSuspended: { type: Boolean, default: false },
  adminNotes: String, rating: { type: Number, default: 5 }, totalDonations: { type: Number, default: 0 },
  beneficiariesCount: Number, joinedDate: { type: String, default: () => new Date().toISOString().slice(0, 10) }
}, { timestamps: true, toJSON: { transform(_doc, ret) { delete ret.passwordHash; delete ret.__v; return ret; } } });

const donationSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  donorName: String, donorType: String, donorPhone: String, donorRating: Number,
  foodName: { type: String, required: true }, category: String, description: String,
  quantity: { type: Number, required: true, min: 0 }, initialQuantity: Number,
  claimedQuantity: { type: Number, default: 0 }, unit: String, image: String, location: String,
  area: String, district: String, distanceKm: Number, preparedAt: String, availableFrom: String,
  availableUntil: String, safeUntil: String, safeConsumptionPeriod: String, storageCondition: String,
  contactPerson: String, contactPhone: String,
  status: { type: String, default: 'Available', index: true }, requestsCount: { type: Number, default: 0 }
}, { timestamps: true });

const requestSchema = new Schema({
  donationId: { type: Schema.Types.ObjectId, ref: 'Donation', required: true, index: true },
  donationCode: String, foodName: String,
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, donorName: String,
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, recipientName: String,
  requestedQuantity: { type: Number, required: true, min: 1 }, requestedUnit: String, message: String,
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'], default: 'Pending', index: true },
  pickupTime: String, pickupDate: String, notes: String, rejectionReason: String
}, { timestamps: true });

const pickupSchema = new Schema({
  donationId: { type: Schema.Types.ObjectId, ref: 'Donation', required: true, index: true },
  requestId: { type: Schema.Types.ObjectId, ref: 'FoodRequest' },
  donorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, donorName: String,
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, recipientName: String,
  foodName: String, quantity: Number, unit: String, pickupDate: String, pickupTime: String,
  location: String, notes: String,
  status: { type: String, enum: ['Pickup Scheduled', 'Collected', 'Completed', 'Cancelled'], default: 'Pickup Scheduled' },
  collectedAt: Date, completedAt: Date
}, { timestamps: true });

const notificationSchema = new Schema({
  targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: String, title: String, message: String,
  relatedDonationId: { type: Schema.Types.ObjectId, ref: 'Donation', default: null },
  metadata: Schema.Types.Mixed, isRead: { type: Boolean, default: false }
}, { timestamps: true });

const ratingSchema = new Schema({
  donationId: { type: Schema.Types.ObjectId, ref: 'Donation', required: true },
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true }, review: String
}, { timestamps: true });
ratingSchema.index({ donationId: 1, fromUserId: 1 }, { unique: true });

export const User = model('User', userSchema);
export const Donation = model('Donation', donationSchema);
export const FoodRequest = model('FoodRequest', requestSchema);
export const Pickup = model('Pickup', pickupSchema);
export const Notification = model('Notification', notificationSchema);
export const Rating = model('Rating', ratingSchema);
