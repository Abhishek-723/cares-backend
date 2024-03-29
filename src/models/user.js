const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('../models/token');

const UserSchema = new mongoose.Schema({
    emailId: {
        type: String,
        unique: true,
        required: [true, "Is required"],
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Is required field"],
    },
    role: {               //required to pass as bruteforce form through frontend
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Is required"],
        max: 100
    },
    phoneNo: {
        type: String,
        required: false,
        max: 100
    },
    firstName: {
        type: String,
        required: [true, "Is required"],
        max: 100
    },
    lastName: {
        type: String,
        required: [true, "Is required"],
        max: 100
    },
    campaigns: [
        {
          campaignId: {
            type: String,
          },
        },
      ],
    payments: [
        {
          paymentId: {
            type: String,
          },
        },
      ],
    state: {
        type: String,
        required: false,
        max: 100
    },
    district: {
        type: String,
        required: false,
        max: 100
    },
    whatsappNumber: {
        type: String,
        required: false,
        max: 100
    },
    organisationName: {
        type: String,
        required: false,
        max: 100
    },
    profileImage: {
        type: String,
        required: false,
        max: 5000
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    },
}, {timestamps: true});


UserSchema.pre('save',  function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    let payload = {
        id: this._id,
        email: this.email,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

UserSchema.methods.generateVerificationToken = function() {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};

module.exports = mongoose.model('Users', UserSchema);