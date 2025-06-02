"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var BRole;
(function (BRole) {
    BRole["Admin"] = "Admin";
    BRole["Manager"] = "Manager";
    BRole["Driver"] = "Driver";
    BRole["Sales"] = "Sales";
})(BRole || (exports.BRole = BRole = {}));
const businessSchema = new mongoose_1.default.Schema({
    businessName: {
        type: String,
        required: true,
    },
    addedBy: {
        type: String,
        required: true,
    },
    businessId: {
        type: String,
        required: true,
    },
    businessCategory: {
        type: String,
        required: true,
    },
    businessSubCategory: {
        type: String,
    },
    businessRegistration: {
        authority: {
            type: String,
        },
        registrationNumber: {
            type: String,
        },
        registrationOn: {
            type: Date,
        },
        expiresOn: {
            type: Date,
        },
    },
    businessAddress: {
        street: {
            type: String,
        },
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
    },
    primaryEmail: {
        type: String,
        required: true,
        unique: true,
    },
    primaryPhone: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Driver", "Sales"],
        default: "Admin",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    website: {
        type: String,
    },
    contactName: {
        type: String,
    },
    socialMedia: [
        {
            platform: {
                type: String,
            },
            url: {
                type: String,
            },
        },
    ],
    imageGallery: [
        {
            type: String,
        },
    ],
    profileIcon: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Business", businessSchema);
