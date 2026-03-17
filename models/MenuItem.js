const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Appetizers', 'Main Course', 'Breads', 'Breads & Rice', 'Dessert', 'Desserts', 'Beverages', 'Accompaniments', 'Snacks', 'Salads', 'Lunch', 'Breakfast'],
            message: '{VALUE} is not a valid category'
        }
    },
    menuType: {
        type: String,
        required: [true, 'Menu type is required'],
        enum: {
            values: ['Birthday Menu', 'Engagement Menu', 'Wedding Menu', 'Corporate Menu', 'Anniversary Menu'],
            message: '{VALUE} is not a valid menu type'
        },
        default: 'Wedding Menu'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    isVegetarian: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        trim: true
    },
    preparationTime: {
        type: Number, // in minutes
        min: 0
    },
    servingSize: {
        type: String,
        trim: true
    },
    allergens: [{
        type: String,
        trim: true
    }],
    spiceLevel: {
        type: String,
        enum: ['Mild', 'Medium', 'Hot', 'Extra Hot', 'None'],
        default: 'Medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for filtering and searching
menuItemSchema.index({ category: 1, menuType: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ isVegetarian: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
