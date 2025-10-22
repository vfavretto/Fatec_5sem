const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    method: {
      type: String,
      required: true,
      default: 'caesar',
      enum: ['caesar', 'rot13', 'base64', 'atbash']
    },
    shift: {
      type: Number,
      required: function() {
        return this.method === 'caesar';
      },
      default: 3,
    },
    used: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Token', tokenSchema);


