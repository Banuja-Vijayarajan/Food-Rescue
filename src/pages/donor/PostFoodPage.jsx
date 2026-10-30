import React, { useState } from 'react';
import { PlusCircle, Bell, Upload, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';

const CATEGORIES = [
  'Prepared meals', 'Rice & Curry', 'Bakery items',
  'Fruits', 'Vegetables', 'Bread & Roti', 'Beverages', 'Other'
];

const DEFAULT_FOOD_IMAGES = [
  {
    label: 'Rice & Curry',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Biryani',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Bakery',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Fresh Produce',
    url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80'
  }
];

export default function PostFoodPage({ onNavigate, onMealPosted }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Prepared meals',
    quantity: '',
    unit: 'portions',
    description: '',
    ingredients: '',
    safeUntil: '',
    packaging: '',
    location: 'Vavuniya Town',
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(DEFAULT_FOOD_IMAGES[0].url);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageError, setImageError] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
      setImageError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.quantity) return;
    if (onMealPosted) {
      onMealPosted({
        title: form.title,
        portions: form.quantity + ' ' + form.unit,
        donorName: 'Green Leaf Hotel & Banquets',
        recipient: 'Auto IVR',
        image: uploadedImage || selectedImage,
        ingredients: form.ingredients,
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        title: '', category: 'Prepared meals', quantity: '',
        unit: 'portions', description: '', ingredients: '', safeUntil: '', packaging: '', location: 'Vavuniya Town'
      });
      setSelectedImage(DEFAULT_FOOD_IMAGES[0].url);
      setUploadedImage(null);
      setImageError('');
      onNavigate('my-donations');
    }, 2200);
  };

  return (
    <div className="fr-dash-view">
      <div className="fr-page-header">
        <div>
          <h1 className="fr-page-title">Post Surplus Food</h1>
          <p className="fr-page-sub">
            List your surplus meal so verified organizations can request it immediately
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="fr-section-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>✅</div>
          <h2 style={{ color: 'var(--fr-primary)', marginTop: '12px' }}>Posted Successfully!</h2>
          <p style={{ color: 'var(--fr-text-muted)', marginTop: '8px', maxWidth: '400px', margin: '12px auto 0' }}>
            Automated IVR calls are being dispatched to all verified nearby welfare organizations now.
          </p>
        </div>
      ) : (
        <div className="fr-section-card" style={{ maxWidth: '780px' }}>
          <form className="fr-modal-form" onSubmit={handleSubmit}>

            <div className="fr-form-row">
              <div className="fr-form-group">
                <label>Food Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Rice & Vegetable Curry Feast"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="fr-form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="fr-form-row">
              <div className="fr-form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  min="1"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="fr-form-group">
                <label>Unit</label>
                <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  <option>portions</option>
                  <option>kg</option>
                  <option>packs</option>
                  <option>boxes</option>
                </select>
              </div>
              <div className="fr-form-group">
                <label>Safe Until (time)</label>
                <input
                  type="time"
                  value={form.safeUntil}
                  onChange={e => setForm({ ...form, safeUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="fr-form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the food, preparation method, allergens, temperature status..."
                rows="3"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="fr-form-group">
              <label>Ingredients</label>
              <textarea
                placeholder="e.g. Rice, dhal, carrot, beans, coconut milk, curry spices..."
                rows="3"
                value={form.ingredients}
                onChange={e => setForm({ ...form, ingredients: e.target.value })}
              />
              <small style={{ color: 'var(--fr-text-muted)', fontSize: '0.75rem', marginTop: '5px' }}>
                Separate ingredients with commas and include any common allergens.
              </small>
            </div>

            <div className="fr-form-row">
              <div className="fr-form-group">
                <label>Packaging / Storage</label>
                <input
                  type="text"
                  placeholder="e.g. Insulated thermal containers at 65°C+"
                  value={form.packaging}
                  onChange={e => setForm({ ...form, packaging: e.target.value })}
                />
              </div>
              <div className="fr-form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>

            <div className="fr-food-image-section">
              <div className="fr-food-image-section-header">
                <div>
                  <label>Food Photo</label>
                  <p>Upload your own photo or select one of the default photos.</p>
                </div>
                <span>Optional</span>
              </div>

              <div className="fr-food-image-preview">
                <img src={uploadedImage || selectedImage} alt="Selected food preview" />
                <div>
                  <ImageIcon size={18} />
                  <span>{uploadedImage ? 'Uploaded photo selected' : 'Default photo selected'}</span>
                </div>
              </div>

              <div className="fr-food-image-upload-row">
                <label className="fr-food-image-upload-btn">
                  <Upload size={16} /> Upload Food Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </label>
                {uploadedImage && (
                  <button
                    type="button"
                    className="fr-food-image-remove-btn"
                    onClick={() => setUploadedImage(null)}
                  >
                    <X size={15} /> Remove Upload
                  </button>
                )}
                <small>JPG, PNG or WEBP • Maximum 5 MB</small>
              </div>

              {imageError && <div className="fr-food-image-error">{imageError}</div>}

              <div className="fr-food-image-presets">
                {DEFAULT_FOOD_IMAGES.map((image) => {
                  const isSelected = !uploadedImage && selectedImage === image.url;
                  return (
                    <button
                      type="button"
                      key={image.url}
                      className={`fr-food-image-preset ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setUploadedImage(null);
                        setSelectedImage(image.url);
                        setImageError('');
                      }}
                    >
                      <img src={image.url} alt={image.label} />
                      <span>{image.label}</span>
                      {isSelected && <CheckCircle2 size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="fr-alert-info">
              <Bell size={15} />
              <span>
                Posting this will trigger <strong>automated IVR phone calls</strong> to all
                verified nearby recipient organizations immediately.
              </span>
            </div>

            <div className="fr-modal-footer">
              <button
                type="button"
                className="fr-btn fr-btn-secondary"
                onClick={() => onNavigate('dashboard')}
              >
                Cancel
              </button>
              <button type="submit" className="fr-btn fr-btn-primary">
                <PlusCircle size={16} /> Post &amp; Notify Orgs
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
