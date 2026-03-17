require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Testimonial = require('./models/Testimonial');
const Booking = require('./models/Booking');
const ContactInquiry = require('./models/ContactInquiry');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in .env file");
    process.exit(1);
}

// Sample Menu Items — Senior Engineering Quality: every image accurately matches its dish
const menuItems = [
    // ═══════════════════════════════════════════
    // WEDDING MENU
    // ═══════════════════════════════════════════
    { name: 'Paneer Tikka', category: 'Appetizers', menuType: 'Wedding Menu', price: 180, isVegetarian: true, description: 'Smoky tandoor-grilled paneer cubes marinated in spiced yogurt', spiceLevel: 'Medium', preparationTime: 30, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dal Makhani', category: 'Main Course', menuType: 'Wedding Menu', price: 200, isVegetarian: true, description: 'Velvety black lentils slow-cooked overnight with cream & butter', spiceLevel: 'Mild', preparationTime: 45, image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&w=800&q=80' },
    { name: 'Shahi Paneer', category: 'Main Course', menuType: 'Wedding Menu', price: 220, isVegetarian: true, description: 'Royal paneer cubes in a rich cashew-cream gravy with saffron', spiceLevel: 'Mild', preparationTime: 35, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Veg Biryani', category: 'Main Course', menuType: 'Wedding Menu', price: 180, isVegetarian: true, description: 'Fragrant basmati rice layered with spiced seasonal vegetables', spiceLevel: 'Medium', preparationTime: 40, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Malai Kofta', category: 'Main Course', menuType: 'Wedding Menu', price: 210, isVegetarian: true, description: 'Golden paneer-potato dumplings in silky cream-tomato gravy', spiceLevel: 'Mild', preparationTime: 40, image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=800&q=80' },
    { name: 'Butter Naan', category: 'Breads', menuType: 'Wedding Menu', price: 40, isVegetarian: true, description: 'Pillowy soft tandoor-baked flatbread brushed with pure butter', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tandoori Roti', category: 'Breads', menuType: 'Wedding Menu', price: 30, isVegetarian: true, description: 'Whole wheat bread baked crisp in a traditional clay tandoor', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hara Bhara Kebab', category: 'Appetizers', menuType: 'Wedding Menu', price: 150, isVegetarian: true, description: 'Vibrant spinach, pea & potato patties pan-fried to perfection', spiceLevel: 'Medium', preparationTime: 25, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
    { name: 'Gulab Jamun', category: 'Dessert', menuType: 'Wedding Menu', price: 80, isVegetarian: true, description: 'Melt-in-mouth golden dumplings soaked in rose-cardamom syrup', spiceLevel: 'None', preparationTime: 30, image: 'https://images.unsplash.com/photo-1666190077490-2d0041dd1583?auto=format&fit=crop&w=800&q=80' },
    { name: 'Rasmalai', category: 'Dessert', menuType: 'Wedding Menu', price: 100, isVegetarian: true, description: 'Delicate chenna discs floating in chilled saffron-cardamom milk', spiceLevel: 'None', preparationTime: 35, image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80' },
    { name: 'Boondi Raita', category: 'Accompaniments', menuType: 'Wedding Menu', price: 50, isVegetarian: true, description: 'Chilled yogurt with crispy boondi pearls & cumin tempering', spiceLevel: 'Mild', preparationTime: 5, image: 'https://images.unsplash.com/photo-1604313271735-e6f851d7c3bc?auto=format&fit=crop&w=800&q=80' },
    { name: 'Kachumber Salad', category: 'Accompaniments', menuType: 'Wedding Menu', price: 60, isVegetarian: true, description: 'Fresh diced cucumber, tomato & onion with lemon dressing', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },

    // ═══════════════════════════════════════════
    // BIRTHDAY MENU
    // ═══════════════════════════════════════════
    { name: 'Margherita Pizza', category: 'Main Course', menuType: 'Birthday Menu', price: 200, isVegetarian: true, description: 'Wood-fired pizza with fresh mozzarella, basil & tomato sauce', spiceLevel: 'Mild', preparationTime: 25, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80' },
    { name: 'Chocolate Fountain', category: 'Dessert', menuType: 'Birthday Menu', price: 280, isVegetarian: true, description: 'Cascading Belgian chocolate with fresh fruits & marshmallows', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=800&q=80' },
    { name: 'Veg Burger', category: 'Main Course', menuType: 'Birthday Menu', price: 140, isVegetarian: true, description: 'Crispy veggie patty burger with cheese, lettuce & special sauce', spiceLevel: 'Mild', preparationTime: 20, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
    { name: 'French Fries', category: 'Snacks', menuType: 'Birthday Menu', price: 90, isVegetarian: true, description: 'Golden crispy fries seasoned with sea salt & peri-peri', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cupcake Assortment', category: 'Dessert', menuType: 'Birthday Menu', price: 70, isVegetarian: true, description: 'Artisan cupcakes with buttercream swirls in assorted flavors', spiceLevel: 'None', preparationTime: 15, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Veg Manchurian', category: 'Appetizers', menuType: 'Birthday Menu', price: 160, isVegetarian: true, description: 'Crispy vegetable balls tossed in tangy Indo-Chinese sauce', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a0956?auto=format&fit=crop&w=800&q=80' },
    { name: 'Chocolate Milkshake', category: 'Beverages', menuType: 'Birthday Menu', price: 110, isVegetarian: true, description: 'Thick & creamy Belgian chocolate milkshake with whipped cream', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80' },

    // ═══════════════════════════════════════════
    // ENGAGEMENT MENU
    // ═══════════════════════════════════════════
    { name: 'Welcome Drink', category: 'Beverages', menuType: 'Engagement Menu', price: 60, isVegetarian: true, description: 'Refreshing rose-flavored welcome mocktails for guests', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Starters Platter', category: 'Appetizers', menuType: 'Engagement Menu', price: 220, isVegetarian: false, description: 'Chef\'s curated assortment of premium hot & cold starters', spiceLevel: 'Medium', preparationTime: 30, image: 'https://images.unsplash.com/photo-1541529086529-1a98078bb4b8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Mushroom Tikka', category: 'Appetizers', menuType: 'Engagement Menu', price: 170, isVegetarian: true, description: 'Tandoor-grilled button mushrooms in spiced yogurt marinade', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&w=800&q=80' },
    { name: 'Paneer Chilli', category: 'Main Course', menuType: 'Engagement Menu', price: 190, isVegetarian: true, description: 'Indo-Chinese style paneer tossed with peppers & onions in chilli sauce', spiceLevel: 'Hot', preparationTime: 20, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Spring Rolls', category: 'Appetizers', menuType: 'Engagement Menu', price: 130, isVegetarian: true, description: 'Crispy golden rolls packed with shredded vegetables & glass noodles', spiceLevel: 'Medium', preparationTime: 15, image: 'https://images.unsplash.com/photo-1544681280-d2dc0c1a6a3b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Brownie with Ice Cream', category: 'Dessert', menuType: 'Engagement Menu', price: 160, isVegetarian: true, description: 'Warm fudgy walnut brownie topped with vanilla ice cream', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80' },
    { name: 'Virgin Mojito', category: 'Beverages', menuType: 'Engagement Menu', price: 90, isVegetarian: true, description: 'Refreshing lime, mint & soda cooler with crushed ice', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1597818318042-fca1203af7bd?auto=format&fit=crop&w=800&q=80' },

    // ═══════════════════════════════════════════
    // CORPORATE MENU
    // ═══════════════════════════════════════════
    { name: 'Executive Thali', category: 'Lunch', menuType: 'Corporate Menu', price: 200, isVegetarian: true, description: 'Complete wholesome thali with dal, sabzi, bread, rice & dessert', spiceLevel: 'Mild', preparationTime: 30, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sandwich Platter', category: 'Snacks', menuType: 'Corporate Menu', price: 150, isVegetarian: true, description: 'Assorted premium grilled & cold club sandwiches', spiceLevel: 'Mild', preparationTime: 15, image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fresh Fruit Bowl', category: 'Dessert', menuType: 'Corporate Menu', price: 90, isVegetarian: true, description: 'Seasonal fresh-cut fruits beautifully arranged', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80' },
    { name: 'Grilled Chicken Salad', category: 'Lunch', menuType: 'Corporate Menu', price: 200, isVegetarian: false, description: 'Tender grilled chicken breast on a bed of fresh greens & vinaigrette', spiceLevel: 'Mild', preparationTime: 20, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80' },
    { name: 'Chai & Biscuits', category: 'Snacks', menuType: 'Corporate Menu', price: 50, isVegetarian: true, description: 'Masala chai with premium assorted biscuit selection', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1555431189-0fabf2667795?auto=format&fit=crop&w=800&q=80' },
    { name: 'Croissants', category: 'Breakfast', menuType: 'Corporate Menu', price: 90, isVegetarian: true, description: 'Buttery flaky French croissants, freshly baked', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' },
    { name: 'Walnut Brownie Box', category: 'Dessert', menuType: 'Corporate Menu', price: 100, isVegetarian: true, description: 'Rich fudgy walnut brownies in a premium gift box', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80' },

    // ═══════════════════════════════════════════
    // ANNIVERSARY MENU
    // ═══════════════════════════════════════════
    { name: 'Stuffed Mushrooms', category: 'Appetizers', menuType: 'Anniversary Menu', price: 180, isVegetarian: true, description: 'Button mushrooms filled with herbed cream cheese & baked golden', spiceLevel: 'Mild', preparationTime: 30, image: 'https://images.unsplash.com/photo-1605656100021-d079d2b7754d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Red Velvet Cake', category: 'Dessert', menuType: 'Anniversary Menu', price: 220, isVegetarian: true, description: 'Classic crimson sponge layers with velvety cream cheese frosting', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Pink Sauce Pasta', category: 'Main Course', menuType: 'Anniversary Menu', price: 230, isVegetarian: true, description: 'Penne tossed in a blush rosé cream-tomato sauce with fresh basil', spiceLevel: 'Mild', preparationTime: 25, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Mushroom Risotto', category: 'Main Course', menuType: 'Anniversary Menu', price: 260, isVegetarian: true, description: 'Creamy Italian Arborio rice with sautéed porcini mushrooms & parmesan', spiceLevel: 'Mild', preparationTime: 40, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tiramisu', category: 'Dessert', menuType: 'Anniversary Menu', price: 220, isVegetarian: true, description: 'Espresso-soaked ladyfingers layered with mascarpone & cocoa', spiceLevel: 'None', preparationTime: 30, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Champagne Mocktail', category: 'Beverages', menuType: 'Anniversary Menu', price: 120, isVegetarian: true, description: 'Sparkling grape fizz with elderflower & a golden shimmer', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1598460773998-cb8680d2830f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cheese Fondue', category: 'Main Course', menuType: 'Anniversary Menu', price: 300, isVegetarian: true, description: 'Melted Gruyère & Emmental cheese pot with artisan bread dippers', spiceLevel: 'Mild', preparationTime: 20, image: 'https://images.unsplash.com/photo-1621262650393-27038e244d2d?auto=format&fit=crop&w=800&q=80' },
];

// Sample Testimonials
const testimonials = [
    {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        rating: 5,
        comment: 'Amazing food and service! Our wedding guests are still talking about the delicious biryani and the beautiful presentation. Rakesh and his team were professional and timely.',
        eventType: 'Wedding',
        eventDate: new Date('2025-12-15'),
        location: 'Mumbai',
        isApproved: true,
        isFeatured: true
    },
    {
        name: 'Rajesh Kumar',
        email: 'rajesh.k@example.com',
        rating: 5,
        comment: 'We hired Shubh Muhurat for our corporate event and they exceeded all expectations. The menu was diverse and accommodated all dietary requirements perfectly.',
        eventType: 'Corporate Event',
        eventDate: new Date('2025-11-20'),
        location: 'Delhi',
        isApproved: true,
        isFeatured: false
    },
    {
        name: 'Anita Desai',
        email: 'anita.d@example.com',
        rating: 4,
        comment: 'Great experience overall. The food was delicious and the staff was courteous. The setup was beautiful and everything was well organized.',
        eventType: 'Birthday Party',
        eventDate: new Date('2025-10-05'),
        location: 'Pune',
        isApproved: true,
        isFeatured: false
    },
    {
        name: 'Vikram Singh',
        email: 'vikram.s@example.com',
        rating: 5,
        comment: 'Exceptional catering service! The quality of ingredients and preparation was top-notch. Highly recommend for any special occasion.',
        eventType: 'Anniversary',
        eventDate: new Date('2025-09-18'),
        location: 'Bangalore',
        isApproved: true,
        isFeatured: true
    },
    {
        name: 'Meera Patel',
        email: 'meera.p@example.com',
        rating: 5,
        comment: 'Perfect for our private family gathering. The team was flexible with our menu requirements and everything was delicious. Will definitely book again!',
        eventType: 'Private Party',
        eventDate: new Date('2025-08-25'),
        location: 'Ahmedabad',
        isApproved: true,
        isFeatured: false
    }
];

// Sample Bookings
const bookings = [
    {
        name: 'Amit Verma',
        email: 'amit.verma@example.com',
        phone: '+91 98765 43210',
        eventType: 'Wedding',
        guests: 500,
        date: new Date('2026-03-15'),
        requests: 'Need both vegetarian and non-vegetarian options. Also require Jain food preparation.',
        status: 'Confirmed',
        totalAmount: 250000
    },
    {
        name: 'Sunita Rao',
        email: 'sunita.rao@example.com',
        phone: '+91 91234 56789',
        eventType: 'Corporate Event',
        guests: 150,
        date: new Date('2026-02-20'),
        requests: 'Lunch buffet for office event. Prefer light and healthy options.',
        status: 'Pending',
        totalAmount: 45000
    },
    {
        name: 'Karan Mehta',
        email: 'karan.m@example.com',
        phone: '+91 87654 32109',
        eventType: 'Birthday Party',
        guests: 80,
        date: new Date('2026-02-10'),
        requests: 'Kids-friendly menu required along with adult options.',
        status: 'Confirmed',
        totalAmount: 32000
    }
];

// Sample Contact Inquiries
const contactInquiries = [
    {
        name: 'Deepak Singh',
        email: 'deepak.singh@example.com',
        phone: '+91 99887 76655',
        subject: 'Quote for Anniversary Party',
        message: 'Hi, I would like to get a quote for catering services for my 25th wedding anniversary. We are expecting around 100 guests. Please provide menu options and pricing.',
        status: 'New',
        priority: 'Medium'
    },
    {
        name: 'Neha Gupta',
        email: 'neha.gupta@example.com',
        phone: '+91 88776 65544',
        subject: 'Dietary Restrictions Query',
        message: 'Do you provide gluten-free and vegan menu options? I am planning a corporate event and need to accommodate various dietary requirements.',
        status: 'Read',
        priority: 'High'
    }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await MenuItem.deleteMany({});
        await Testimonial.deleteMany({});
        await Booking.deleteMany({});
        await ContactInquiry.deleteMany({});

        // Insert new data
        console.log('📝 Inserting menu items...');
        const insertedMenuItems = await MenuItem.insertMany(menuItems);
        console.log(`✅ Inserted ${insertedMenuItems.length} menu items`);

        console.log('📝 Inserting testimonials...');
        const insertedTestimonials = await Testimonial.insertMany(testimonials);
        console.log(`✅ Inserted ${insertedTestimonials.length} testimonials`);

        console.log('📝 Inserting bookings...');
        const insertedBookings = await Booking.insertMany(bookings);
        console.log(`✅ Inserted ${insertedBookings.length} bookings`);

        console.log('📝 Inserting contact inquiries...');
        const insertedInquiries = await ContactInquiry.insertMany(contactInquiries);
        console.log(`✅ Inserted ${insertedInquiries.length} contact inquiries`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Menu Items: ${insertedMenuItems.length}`);
        console.log(`   Testimonials: ${insertedTestimonials.length}`);
        console.log(`   Bookings: ${insertedBookings.length}`);
        console.log(`   Contact Inquiries: ${insertedInquiries.length}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

// Run the seed function
seedDatabase();
