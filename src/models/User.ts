import mongoose, { Document, Schema, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  medipassId: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  password: string;
  pin: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bloodGroup?: string;
  emergencyContact: string;
  role: 'patient' | 'doctor' | 'admin';
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isBiometricEnabled: boolean;
  biometricToken?: string;
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  refreshToken?: string;
  otp?: {
    code: string;
    expiresAt: Date;
    attempts: number;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  comparePin: (candidatePin: string) => Promise<boolean>;
  incrementLoginAttempts: () => Promise<void>;
  generateMedipassId: () => string;
  isModified: (path: string) => boolean;
}

const userSchema = new Schema<IUser>({
  medipassId: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  emergencyContact: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  isBiometricEnabled: {
    type: Boolean,
    default: false,
  },
  biometricToken: String,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
  lastLogin: Date,
  refreshToken: String,
  otp: {
    code: String,
    expiresAt: Date,
    attempts: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Pre-save middleware to hash password and PIN
userSchema.pre('save', async function(next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password') && !this.isModified('pin')) {
    return next();
  }

  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified('pin')) {
      const salt = await bcrypt.genSalt(10);
      this.pin = await bcrypt.hash(this.pin, salt);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to compare PIN
userSchema.methods.comparePin = async function(candidatePin: string): Promise<boolean> {
  return bcrypt.compare(candidatePin, this.pin);
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  const lockTime = 30 * 60 * 1000; // 30 minutes

  if (this.lockUntil && this.lockUntil > new Date()) {
    return;
  }

  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + lockTime);
  }

  await this.save();
};

// Method to generate Medipass ID
userSchema.methods.generateMedipassId = function(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MED-${timestamp}${randomNum}`;
};

// Index for performance optimization
userSchema.index({ medipassId: 1 });
userSchema.index({ mobileNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'address.pincode': 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User; 