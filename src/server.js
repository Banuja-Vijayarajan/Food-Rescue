import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Donation, FoodRequest, Pickup, Notification, Rating } from './models.js';

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET;
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '12mb' }));

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const idOf = (obj) => obj?._id?.toString();
const tokenFor = (user) => jwt.sign({ sub: idOf(user), role: user.role }, jwtSecret, { expiresIn: '7d' });
const safeUser = (user) => { const value = user.toObject ? user.toObject() : { ...user }; delete value.passwordHash; delete value.__v; return { ...value, id: idOf(user) || user.id }; };

const auth = asyncRoute(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user || user.isSuspended) return res.status(401).json({ message: 'Account unavailable.' });
    req.user = user;
    next();
  } catch { return res.status(401).json({ message: 'Invalid or expired token.' }); }
});
const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission to perform this action.' });
const notify = (targetUserId, type, title, message, relatedDonationId = null, metadata) => Notification.create({ targetUserId, type, title, message, relatedDonationId, metadata });
const notifyDonorAndRecipient = async (request, type, title, message, relatedDonationId) => Promise.all([
  notify(request.donorId, type, title, message, relatedDonationId),
  notify(request.recipientId, type, title, message, relatedDonationId)
]);
const cleanDonation = (d) => ({ ...d.toObject(), id: idOf(d), donorId: idOf(d.donorId) || d.donorId });
const cleanRequest = (d) => ({ ...d.toObject(), id: idOf(d), donationId: idOf(d.donationId), donorId: idOf(d.donorId), recipientId: idOf(d.recipientId) });
const cleanPickup = (d) => ({ ...d.toObject(), id: idOf(d), donationId: idOf(d.donationId), donorId: idOf(d.donorId), recipientId: idOf(d.recipientId) });

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const { role, name, email, password, ...profile } = req.body;
  if (!['donor', 'recipient'].includes(role)) return res.status(400).json({ message: 'Registration is only open to donors and recipient organizations.' });
  if (!name?.trim() || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email, and a password of at least 6 characters are required.' });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email is already registered.' });
  const user = await User.create({ role, name: name.trim(), email, ...profile, passwordHash: await bcrypt.hash(password, 12) });
  const admins = await User.find({ role: 'admin' }).select('_id');
  await Promise.all(admins.map((admin) => notify(admin._id, 'VERIFICATION_REQUEST', 'New Organization Verification Required', `${user.name} (${user.organizationType || user.role}) has registered and submitted credentials for approval.`)));
  res.status(201).json({ user: safeUser(user), token: tokenFor(user) });
}));
app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() }).select('+passwordHash');
  if (!user || !await bcrypt.compare(req.body.password || '', user.passwordHash)) return res.status(401).json({ message: 'Invalid email or password.' });
  if (user.isSuspended) return res.status(403).json({ message: 'This account has been suspended.' });
  res.json({ user: safeUser(user), token: tokenFor(user) });
}));
app.get('/api/auth/me', auth, (req, res) => res.json({ user: safeUser(req.user) }));
app.post('/api/auth/logout', auth, (_req, res) => res.json({ message: 'Logged out.' }));

app.get('/api/users', auth, allow('admin'), asyncRoute(async (req, res) => res.json(await User.find().sort({ createdAt: -1 }))));
app.get('/api/users/:id', auth, asyncRoute(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) return res.status(403).json({ message: 'Access denied.' });
  const user = await User.findById(req.params.id);
  return user ? res.json(safeUser(user)) : res.status(404).json({ message: 'User not found.' });
}));
app.patch('/api/users/me', auth, asyncRoute(async (req, res) => {
  const allowed = ['name', 'organizationType', 'contactPerson', 'phone', 'address', 'city', 'district', 'regNumber', 'description', 'avatar', 'beneficiariesCount'];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true });
  res.json(safeUser(user));
}));
app.patch('/api/admin/users/:id/verification', auth, allow('admin'), asyncRoute(async (req, res) => {
  const { status, notes = '' } = req.body;
  if (!['Verified', 'Pending', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid verification status.' });
  const user = await User.findByIdAndUpdate(req.params.id, { verificationStatus: status, isVerified: status === 'Verified', adminNotes: notes }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found.' });
  await notify(user._id, 'VERIFICATION_UPDATE', status === 'Verified' ? 'Organization Verified!' : 'Verification Update', status === 'Verified' ? 'Your organization has been verified.' : `Verification status updated: ${status}. ${notes}`);
  res.json(safeUser(user));
}));
app.patch('/api/admin/users/:id/suspension', auth, allow('admin'), asyncRoute(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  user.isSuspended = !user.isSuspended; await user.save(); res.json(safeUser(user));
}));

app.get('/api/donations', asyncRoute(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.area) filter.area = new RegExp(String(req.query.area), 'i');
  if (req.query.donorId) filter.donorId = req.query.donorId;
  if (req.query.available === 'true') filter.status = { $in: ['Available', 'Partially Claimed'] };
  const donations = await Donation.find(filter).populate('donorId', 'name email phone organizationType rating').sort({ createdAt: -1 });
  res.json(donations.map(cleanDonation));
}));
app.get('/api/donations/:id', asyncRoute(async (req, res) => {
  const d = await Donation.findById(req.params.id).populate('donorId', 'name email phone organizationType rating');
  return d ? res.json(cleanDonation(d)) : res.status(404).json({ message: 'Donation not found.' });
}));
app.post('/api/donations', auth, allow('donor'), asyncRoute(async (req, res) => {
  if (!req.user.isVerified) return res.status(403).json({ message: 'Your organization must be verified before posting donations.' });
  const quantity = Number(req.body.quantity);
  if (!req.body.foodName || !Number.isFinite(quantity) || quantity <= 0) return res.status(400).json({ message: 'Food name and a positive quantity are required.' });
  const d = await Donation.create({ ...req.body, donorId: req.user._id, donorName: req.user.name, donorType: req.user.organizationType, donorPhone: req.user.phone, donorRating: req.user.rating, quantity, initialQuantity: quantity, claimedQuantity: 0, status: 'Available' });
  await User.updateOne({ _id: req.user._id }, { $inc: { totalDonations: 1 } });
  const recipients = await User.find({ role: 'recipient', isVerified: true }).select('_id');
  await Promise.all(recipients.map(({ _id }) => notify(_id, 'NEW_DONATION', 'New Food Donation Available', `${d.foodName} is available near ${d.area || 'your area'}.`, d._id, { foodName: d.foodName, quantity, unit: d.unit, donorName: req.user.name, area: d.area })));
  res.status(201).json(cleanDonation(d));
}));
app.patch('/api/donations/:id', auth, asyncRoute(async (req, res) => {
  const d = await Donation.findById(req.params.id);
  if (!d) return res.status(404).json({ message: 'Donation not found.' });
  if (req.user.role !== 'admin' && idOf(d.donorId) !== req.user.id) return res.status(403).json({ message: 'Only the donor or an administrator can update this donation.' });
  const allowed = ['foodName','category','description','quantity','unit','image','location','area','district','preparedAt','availableFrom','availableUntil','safeUntil','safeConsumptionPeriod','storageCondition','contactPerson','contactPhone','status'];
  for (const key of allowed) if (req.body[key] !== undefined) d[key] = req.body[key];
  await d.save(); res.json(cleanDonation(d));
}));

app.get('/api/requests', auth, asyncRoute(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : req.user.role === 'donor' ? { donorId: req.user._id } : { recipientId: req.user._id };
  res.json((await FoodRequest.find(filter).sort({ createdAt: -1 })).map(cleanRequest));
}));
app.post('/api/donations/:id/requests', auth, allow('recipient'), asyncRoute(async (req, res) => {
  if (!req.user.isVerified) return res.status(403).json({ message: 'Your organization must be verified before requesting food.' });
  const d = await Donation.findById(req.params.id);
  const requestedQuantity = Number(req.body.requestedQuantity);
  if (!d || !['Available', 'Partially Claimed'].includes(d.status)) return res.status(404).json({ message: 'This donation is no longer available.' });
  if (idOf(d.donorId) === req.user.id) return res.status(400).json({ message: 'You cannot request your own donation.' });
  if (!requestedQuantity || requestedQuantity > d.quantity) return res.status(400).json({ message: 'Requested quantity must be within the available amount.' });
  const request = await FoodRequest.create({ donationId: d._id, donationCode: d.id, foodName: d.foodName, donorId: d.donorId, donorName: d.donorName, recipientId: req.user._id, recipientName: req.user.name, requestedQuantity, requestedUnit: req.body.requestedUnit || d.unit, message: req.body.message });
  d.requestsCount += 1; if (d.status === 'Available') d.status = 'Requested'; await d.save();
  await notify(d.donorId, 'REQUEST_CREATED', 'New Donation Request Received', `${req.user.name} requested ${requestedQuantity} ${request.requestedUnit} of ${d.foodName}.`, d._id);
  res.status(201).json(cleanRequest(request));
}));
app.patch('/api/requests/:id/accept', auth, allow('donor'), asyncRoute(async (req, res) => {
  const request = await FoodRequest.findById(req.params.id); if (!request) return res.status(404).json({ message: 'Request not found.' });
  if (idOf(request.donorId) !== req.user.id) return res.status(403).json({ message: 'Only the donation owner can accept this request.' });
  if (request.status !== 'Pending') return res.status(409).json({ message: 'This request has already been handled.' });
  const d = await Donation.findById(request.donationId); if (!d || d.quantity < request.requestedQuantity) return res.status(409).json({ message: 'Not enough food remains to accept this request.' });
  request.status = 'Accepted'; request.pickupDate = req.body.pickupDate; request.pickupTime = req.body.pickupTime; request.notes = req.body.notes; await request.save();
  d.quantity -= request.requestedQuantity; d.claimedQuantity += request.requestedQuantity; d.status = d.quantity === 0 ? 'Pickup Scheduled' : 'Partially Claimed'; await d.save();
  await Pickup.create({ donationId: d._id, requestId: request._id, donorId: d.donorId, donorName: d.donorName, recipientId: request.recipientId, recipientName: request.recipientName, foodName: d.foodName, quantity: request.requestedQuantity, unit: request.requestedUnit, pickupDate: request.pickupDate, pickupTime: request.pickupTime, location: d.location, notes: request.notes, status: 'Pickup Scheduled' });
  await notify(request.recipientId, 'REQUEST_ACCEPTED', 'Request Accepted & Pickup Scheduled', `Your request for ${d.foodName} has been accepted.`, d._id);
  res.json({ request: cleanRequest(request), donation: cleanDonation(d) });
}));
app.patch('/api/requests/:id/reject', auth, allow('donor'), asyncRoute(async (req, res) => {
  const request = await FoodRequest.findById(req.params.id); if (!request) return res.status(404).json({ message: 'Request not found.' });
  if (idOf(request.donorId) !== req.user.id) return res.status(403).json({ message: 'Only the donation owner can reject this request.' });
  request.status = 'Rejected'; request.rejectionReason = req.body.reason || ''; await request.save();
  await notify(request.recipientId, 'REQUEST_REJECTED', 'Donation Request Not Accepted', `Your request for ${request.foodName} could not be accepted. ${request.rejectionReason}`, request.donationId);
  res.json(cleanRequest(request));
}));

app.get('/api/pickups', auth, asyncRoute(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { [req.user.role === 'donor' ? 'donorId' : 'recipientId']: req.user._id };
  res.json((await Pickup.find(filter).sort({ createdAt: -1 })).map(cleanPickup));
}));
app.patch('/api/pickups/:id/collect', auth, allow('recipient'), asyncRoute(async (req, res) => {
  const p = await Pickup.findById(req.params.id); if (!p) return res.status(404).json({ message: 'Pickup not found.' });
  if (idOf(p.recipientId) !== req.user.id) return res.status(403).json({ message: 'Only the assigned recipient can confirm collection.' });
  p.status = 'Collected'; p.collectedAt = new Date(); await p.save();
  await notify(p.donorId, 'COLLECTION_CONFIRMED', 'Food Collection Confirmed', `${req.user.name} has collected ${p.foodName}.`, p.donationId);
  res.json(cleanPickup(p));
}));
app.patch('/api/pickups/:id/complete', auth, asyncRoute(async (req, res) => {
  const p = await Pickup.findById(req.params.id); if (!p) return res.status(404).json({ message: 'Pickup not found.' });
  if (![idOf(p.donorId), idOf(p.recipientId)].includes(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Only the involved organizations can confirm handover.' });
  p.status = 'Completed'; p.completedAt = new Date(); await p.save();
  await Donation.updateOne({ _id: p.donationId }, { status: 'Completed' });
  if (p.requestId) await FoodRequest.updateOne({ _id: p.requestId }, { status: 'Completed' });
  await notifyDonorAndRecipient(p, 'DONATION_COMPLETED', 'Donation Completed Successfully', `Handover for ${p.foodName} has been completed.`, p.donationId);
  res.json(cleanPickup(p));
}));

app.get('/api/notifications', auth, asyncRoute(async (req, res) => res.json(await Notification.find(req.user.role === 'admin' && req.query.all === 'true' ? {} : { targetUserId: req.user._id }).sort({ createdAt: -1 }))));
app.patch('/api/notifications/read-all', auth, asyncRoute(async (req, res) => { await Notification.updateMany({ targetUserId: req.user._id }, { isRead: true }); res.json({ message: 'Notifications marked as read.' }); }));
app.patch('/api/notifications/:id/read', auth, asyncRoute(async (req, res) => {
  const n = await Notification.findOneAndUpdate({ _id: req.params.id, targetUserId: req.user._id }, { isRead: true }, { new: true });
  return n ? res.json(n) : res.status(404).json({ message: 'Notification not found.' });
}));

app.get('/api/ratings', auth, asyncRoute(async (req, res) => {
  const filter = req.query.userId ? { $or: [{ fromUserId: req.query.userId }, { toUserId: req.query.userId }] } : {};
  res.json(await Rating.find(filter).sort({ createdAt: -1 }));
}));
app.post('/api/ratings', auth, asyncRoute(async (req, res) => {
  const { donationId, toUserId, rating, review } = req.body;
  if (!Number.isFinite(Number(rating)) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  const d = await Donation.findById(donationId); if (!d || d.status !== 'Completed') return res.status(400).json({ message: 'Only completed donations can be rated.' });
  if (![idOf(d.donorId), ...await FoodRequest.find({ donationId: d._id, status: 'Completed' }).distinct('recipientId').then(xs => xs.map(String))].includes(req.user.id)) return res.status(403).json({ message: 'Only organizations involved can rate this donation.' });
  const ratingDoc = await Rating.create({ donationId, fromUserId: req.user._id, toUserId, rating: Number(rating), review });
  const ratings = await Rating.find({ toUserId });
  await User.updateOne({ _id: toUserId }, { rating: Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)) });
  res.status(201).json(ratingDoc);
}));

app.get('/api/admin/stats', auth, allow('admin'), asyncRoute(async (_req, res) => {
  const [users, donations, requests, completed, meals] = await Promise.all([
    User.countDocuments(), Donation.countDocuments(), FoodRequest.countDocuments(), Donation.countDocuments({ status: 'Completed' }),
    Donation.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$initialQuantity' } } }])
  ]);
  const totalMealsRescued = meals[0]?.total || 0;
  res.json({ users, donations, requests, completed, totalMealsRescued, totalKgRescued: Math.round(totalMealsRescued * .45), totalCo2SavedKg: Math.round(totalMealsRescued * .45 * 2.1) });
}));

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  if (err.code === 11000) return res.status(409).json({ message: 'A record with this value already exists.' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid record id.' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: 'Server error.' });
});

if (!jwtSecret) throw new Error('JWT_SECRET is required. Copy .env.example to .env and configure it.');
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_rescue');
app.listen(port, () => console.log(`Food Rescue API listening on http://localhost:${port}`));
