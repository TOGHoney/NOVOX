const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        joinedAt: { type: Date, default: Date.now },
        speakingMs: { type: Number, default: 0 }
    },
    { _id: false }
);

const debateRoomSchema = new mongoose.Schema(
    {
        host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        topic: { type: String, required: true, trim: true },
        prompt: { type: String, trim: true, default: '' },
        language: { type: String, default: 'English' },
        level: { type: String, default: 'A1' },
        maxParticipants: { type: Number, default: 6, min: 2, max: 20 },
        status: { type: String, enum: ['open', 'active', 'closed'], default: 'open' },
        participants: { type: [participantSchema], default: [] },
        floor: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            grantedAt: { type: Date, default: null }
        }
    },
    { timestamps: true }
);

debateRoomSchema.methods.isFull = function () {
    return this.participants.length >= this.maxParticipants;
};

debateRoomSchema.methods.isParticipant = function (userId) {
    return this.participants.some((p) => {
        const id = p.user?._id || p.user;
        return id.toString() === userId.toString();
    });
};

module.exports = mongoose.model('DebateRoom', debateRoomSchema);
