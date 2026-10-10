import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimantName: { type: String, required: true },
  claimantEmail: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: '' },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    },
    status: {
      type: String,
      enum: ['Reported', 'Searching', 'Possible Match', 'Contacted', 'Verified', 'Returned'],
      default: 'Searching'
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contactName: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    claims: [claimSchema]
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
