import mongoose from 'mongoose';

// Schema for Component NFTs
const ComponentNFTSchema = new mongoose.Schema({
  objectID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  component_type: {
    type: String,
    required: true,
  },
  equipped_on: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentNFT',
    default: null,
  },
});

// Schema for Parent NFTs
const ParentNFTSchema = new mongoose.Schema({
  objectID: {
    type: String,
    required: true,
    unqiue: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  equipped_components: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComponentNFT',
    },
  ],
});

// Schema for Owner
const OwnerSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  parentNFTs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentNFT',
  },
  componentNFTs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComponentNFT',
  },
});

// Create models if they don't exist
const Owner = mongoose.models.Owner || mongoose.model('Owner', OwnerSchema);
const ParentNFT =
  mongoose.models.ParentNFT || mongoose.model('ParentNFT', ParentNFTSchema);
const ComponentNFT =
  mongoose.models.ComponentNFT ||
  mongoose.model('ComponentNFT', ComponentNFTSchema);

export { Owner, ParentNFT, ComponentNFT };
