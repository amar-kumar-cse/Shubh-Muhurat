/**
 * Mock Data for fallback when API is not available
 * Senior Engineering Quality — Every image accurately matches its dish name
 */

const MOCK_DATA = {
    menuItems: [
        // ═══════════════════════════════════════════
        // 1. WEDDING MENU (15 items)
        // ═══════════════════════════════════════════
        { name: 'Paneer Tikka', category: 'Appetizers', menuType: 'Wedding Menu', price: 180, isVegetarian: true, description: 'Smoky tandoor-grilled paneer cubes marinated in spiced yogurt', spiceLevel: 'Medium', preparationTime: 30, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80' },
        { name: 'Dal Makhani', category: 'Main Course', menuType: 'Wedding Menu', price: 200, isVegetarian: true, description: 'Velvety black lentils slow-cooked overnight with cream & butter', spiceLevel: 'Mild', preparationTime: 45, image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&w=800&q=80' },
        { name: 'Shahi Paneer', category: 'Main Course', menuType: 'Wedding Menu', price: 220, isVegetarian: true, description: 'Royal paneer cubes in a rich cashew-cream gravy with saffron', spiceLevel: 'Mild', preparationTime: 35, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veg Biryani', category: 'Main Course', menuType: 'Wedding Menu', price: 180, isVegetarian: true, description: 'Fragrant basmati rice layered with spiced seasonal vegetables', spiceLevel: 'Medium', preparationTime: 40, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
        { name: 'Malai Kofta', category: 'Main Course', menuType: 'Wedding Menu', price: 210, isVegetarian: true, description: 'Golden paneer-potato dumplings in silky cream-tomato gravy', spiceLevel: 'Mild', preparationTime: 40, image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=800&q=80' },
        { name: 'Butter Naan', category: 'Breads', menuType: 'Wedding Menu', price: 40, isVegetarian: true, description: 'Pillowy soft tandoor-baked flatbread brushed with pure butter', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80' },
        { name: 'Tandoori Roti', category: 'Breads', menuType: 'Wedding Menu', price: 30, isVegetarian: true, description: 'Whole wheat bread baked crisp in a traditional clay tandoor', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80' },
        { name: 'Hara Bhara Kebab', category: 'Appetizers', menuType: 'Wedding Menu', price: 150, isVegetarian: true, description: 'Vibrant spinach, pea & potato patties pan-fried to perfection', spiceLevel: 'Medium', preparationTime: 25, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
        { name: 'Paneer Spring Rolls', category: 'Appetizers', menuType: 'Wedding Menu', price: 130, isVegetarian: true, description: 'Crispy golden rolls stuffed with spiced paneer & vegetables', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1544681280-d2dc0c1a6a3b?auto=format&fit=crop&w=800&q=80' },
        { name: 'Gulab Jamun', category: 'Dessert', menuType: 'Wedding Menu', price: 80, isVegetarian: true, description: 'Melt-in-mouth golden dumplings soaked in rose-cardamom syrup', spiceLevel: 'None', preparationTime: 30, image: 'https://images.unsplash.com/photo-1666190077490-2d0041dd1583?auto=format&fit=crop&w=800&q=80' },
        { name: 'Rasmalai', category: 'Dessert', menuType: 'Wedding Menu', price: 100, isVegetarian: true, description: 'Delicate chenna discs floating in chilled saffron-cardamom milk', spiceLevel: 'None', preparationTime: 35, image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80' },
        { name: 'Moong Dal Halwa', category: 'Dessert', menuType: 'Wedding Menu', price: 110, isVegetarian: true, description: 'Rich lentil pudding slow-cooked in pure desi ghee & garnished with nuts', spiceLevel: 'None', preparationTime: 45, image: 'https://images.unsplash.com/photo-1628062973977-94d80a184e96?auto=format&fit=crop&w=800&q=80' },
        { name: 'Boondi Raita', category: 'Accompaniments', menuType: 'Wedding Menu', price: 50, isVegetarian: true, description: 'Chilled yogurt with crispy boondi pearls & cumin tempering', spiceLevel: 'Mild', preparationTime: 5, image: 'https://images.unsplash.com/photo-1604313271735-e6f851d7c3bc?auto=format&fit=crop&w=800&q=80' },
        { name: 'Kachumber Salad', category: 'Accompaniments', menuType: 'Wedding Menu', price: 60, isVegetarian: true, description: 'Fresh diced cucumber, tomato & onion with lemon dressing', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
        { name: 'Masala Papad', category: 'Accompaniments', menuType: 'Wedding Menu', price: 40, isVegetarian: true, description: 'Crispy papad topped with tangy onion-tomato masala', spiceLevel: 'Medium', preparationTime: 10, image: 'https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&w=800&q=80' },

        // ═══════════════════════════════════════════
        // 2. ANNIVERSARY MENU (15 items)
        // ═══════════════════════════════════════════
        { name: 'Stuffed Mushrooms', category: 'Appetizers', menuType: 'Anniversary Menu', price: 180, isVegetarian: true, description: 'Button mushrooms filled with herbed cream cheese & baked golden', spiceLevel: 'Mild', preparationTime: 30, image: 'https://images.unsplash.com/photo-1605656100021-d079d2b7754d?auto=format&fit=crop&w=800&q=80' },
        { name: 'Bruschetta', category: 'Appetizers', menuType: 'Anniversary Menu', price: 150, isVegetarian: true, description: 'Toasted crostini topped with vine-ripe tomatoes, basil & balsamic', spiceLevel: 'Mild', preparationTime: 15, image: 'https://images.unsplash.com/photo-1572695157363-bc31c5dd398d?auto=format&fit=crop&w=800&q=80' },
        { name: 'Heart-Shaped Cutlets', category: 'Appetizers', menuType: 'Anniversary Menu', price: 140, isVegetarian: true, description: 'Crispy pan-fried vegetable cutlets shaped as hearts', spiceLevel: 'Medium', preparationTime: 25, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
        { name: 'Mushroom Risotto', category: 'Main Course', menuType: 'Anniversary Menu', price: 260, isVegetarian: true, description: 'Creamy Italian Arborio rice with sautéed porcini mushrooms & parmesan', spiceLevel: 'Mild', preparationTime: 40, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80' },
        { name: 'Pink Sauce Pasta', category: 'Main Course', menuType: 'Anniversary Menu', price: 230, isVegetarian: true, description: 'Penne tossed in a blush rosé cream-tomato sauce with fresh basil', spiceLevel: 'Mild', preparationTime: 25, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80' },
        { name: 'Cheese Fondue', category: 'Main Course', menuType: 'Anniversary Menu', price: 300, isVegetarian: true, description: 'Melted Gruyère & Emmental cheese pot with artisan bread dippers', spiceLevel: 'None', preparationTime: 20, image: 'https://images.unsplash.com/photo-1621262650393-27038e244d2d?auto=format&fit=crop&w=800&q=80' },
        { name: 'Candlelight Dinner Set', category: 'Main Course', menuType: 'Anniversary Menu', price: 400, isVegetarian: false, description: 'Specially curated multi-course romantic dinner for couples', spiceLevel: 'Mild', preparationTime: 45, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80' },
        { name: 'Red Velvet Cake', category: 'Dessert', menuType: 'Anniversary Menu', price: 220, isVegetarian: true, description: 'Classic crimson sponge layers with velvety cream cheese frosting', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80' },
        { name: 'Tiramisu', category: 'Dessert', menuType: 'Anniversary Menu', price: 220, isVegetarian: true, description: 'Espresso-soaked ladyfingers layered with mascarpone & cocoa', spiceLevel: 'None', preparationTime: 30, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80' },
        { name: 'Chocolate Covered Strawberries', category: 'Dessert', menuType: 'Anniversary Menu', price: 200, isVegetarian: true, description: 'Premium strawberries dipped in Belgian dark chocolate', spiceLevel: 'None', preparationTime: 20, image: 'https://images.unsplash.com/photo-1599901839615-a4773ce56e30?auto=format&fit=crop&w=800&q=80' },
        { name: 'Fruit Tarts', category: 'Dessert', menuType: 'Anniversary Menu', price: 140, isVegetarian: true, description: 'Buttery pastry shells with vanilla custard & glazed seasonal fruits', spiceLevel: 'None', preparationTime: 25, image: 'https://images.unsplash.com/photo-1504113882839-58e80710675c?auto=format&fit=crop&w=800&q=80' },
        { name: 'Champagne Mocktail', category: 'Beverages', menuType: 'Anniversary Menu', price: 120, isVegetarian: true, description: 'Sparkling grape fizz with elderflower & a golden shimmer', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1598460773998-cb8680d2830f?auto=format&fit=crop&w=800&q=80' },
        { name: 'Blue Lagoon Mocktail', category: 'Beverages', menuType: 'Anniversary Menu', price: 100, isVegetarian: true, description: 'Refreshing blue curaçao-lemonade cooler with crushed ice', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
        { name: 'Greek Salad', category: 'Salads', menuType: 'Anniversary Menu', price: 160, isVegetarian: true, description: 'Crisp romaine, olives, feta cheese & sun-dried tomatoes', spiceLevel: 'None', preparationTime: 15, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80' },
        { name: 'Garlic Bread', category: 'Breads', menuType: 'Anniversary Menu', price: 90, isVegetarian: true, description: 'Crispy baguette slices with roasted garlic butter & herbs', spiceLevel: 'Mild', preparationTime: 15, image: 'https://images.unsplash.com/photo-1619531040576-f3e32abf8cd8?auto=format&fit=crop&w=800&q=80' },

        // ═══════════════════════════════════════════
        // 3. BIRTHDAY MENU (15 items)
        // ═══════════════════════════════════════════
        { name: 'Margherita Pizza', category: 'Main Course', menuType: 'Birthday Menu', price: 200, isVegetarian: true, description: 'Wood-fired pizza with fresh mozzarella, basil & tomato sauce', spiceLevel: 'Mild', preparationTime: 25, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veg Burger', category: 'Main Course', menuType: 'Birthday Menu', price: 140, isVegetarian: true, description: 'Crispy veggie patty burger with cheese, lettuce & special sauce', spiceLevel: 'Mild', preparationTime: 20, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
        { name: 'Mac & Cheese', category: 'Main Course', menuType: 'Birthday Menu', price: 170, isVegetarian: true, description: 'Creamy elbow macaroni baked with three-cheese blend', spiceLevel: 'None', preparationTime: 20, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veg Hakka Noodles', category: 'Main Course', menuType: 'Birthday Menu', price: 150, isVegetarian: true, description: 'Wok-tossed noodles with crunchy vegetables & soy-chilli sauce', spiceLevel: 'Medium', preparationTime: 15, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veg Manchurian', category: 'Appetizers', menuType: 'Birthday Menu', price: 160, isVegetarian: true, description: 'Crispy vegetable balls tossed in tangy Indo-Chinese sauce', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a0956?auto=format&fit=crop&w=800&q=80' },
        { name: 'French Fries', category: 'Snacks', menuType: 'Birthday Menu', price: 90, isVegetarian: true, description: 'Golden crispy fries seasoned with sea salt & peri-peri', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80' },
        { name: 'Nachos Supreme', category: 'Snacks', menuType: 'Birthday Menu', price: 120, isVegetarian: true, description: 'Loaded tortilla chips with melted cheese, salsa & jalapeños', spiceLevel: 'Mild', preparationTime: 10, image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=800&q=80' },
        { name: 'Popcorn Bucket', category: 'Snacks', menuType: 'Birthday Menu', price: 50, isVegetarian: true, description: 'Classic butter & caramel popcorn party bucket', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80' },
        { name: 'Chocolate Fountain', category: 'Dessert', menuType: 'Birthday Menu', price: 280, isVegetarian: true, description: 'Cascading Belgian chocolate with fresh fruits & marshmallows', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=800&q=80' },
        { name: 'Cupcake Assortment', category: 'Dessert', menuType: 'Birthday Menu', price: 70, isVegetarian: true, description: 'Artisan cupcakes with buttercream swirls in assorted flavors', spiceLevel: 'None', preparationTime: 15, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80' },
        { name: 'Cotton Candy', category: 'Dessert', menuType: 'Birthday Menu', price: 40, isVegetarian: true, description: 'Hand-spun fluffy cotton candy in rainbow colors', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1534073828943-f801091a7d58?auto=format&fit=crop&w=800&q=80' },
        { name: 'Ice Cream Sundae', category: 'Dessert', menuType: 'Birthday Menu', price: 100, isVegetarian: true, description: 'Triple-scoop sundae with chocolate fudge, nuts & cherry on top', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80' },
        { name: 'Fruit Skewers', category: 'Dessert', menuType: 'Birthday Menu', price: 100, isVegetarian: true, description: 'Rainbow fruit kabobs with honey-mint drizzle', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1528659424747-98522e86dc3c?auto=format&fit=crop&w=800&q=80' },
        { name: 'Chocolate Milkshake', category: 'Beverages', menuType: 'Birthday Menu', price: 110, isVegetarian: true, description: 'Thick & creamy Belgian chocolate milkshake with whipped cream', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80' },
        { name: 'Fresh Lemonade', category: 'Beverages', menuType: 'Birthday Menu', price: 60, isVegetarian: true, description: 'Chilled fresh-squeezed lemonade with mint & crushed ice', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80' },

        // ═══════════════════════════════════════════
        // 4. ENGAGEMENT MENU (15 items)
        // ═══════════════════════════════════════════
        { name: 'Welcome Drink', category: 'Beverages', menuType: 'Engagement Menu', price: 60, isVegetarian: true, description: 'Refreshing rose-flavored welcome mocktails for guests', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80' },
        { name: 'Virgin Mojito', category: 'Beverages', menuType: 'Engagement Menu', price: 90, isVegetarian: true, description: 'Refreshing lime, mint & soda cooler with crushed ice', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1597818318042-fca1203af7bd?auto=format&fit=crop&w=800&q=80' },
        { name: 'Starters Platter', category: 'Appetizers', menuType: 'Engagement Menu', price: 220, isVegetarian: false, description: 'Chef\'s curated assortment of premium hot & cold starters', spiceLevel: 'Medium', preparationTime: 30, image: 'https://images.unsplash.com/photo-1541529086529-1a98078bb4b8?auto=format&fit=crop&w=800&q=80' },
        { name: 'Mushroom Tikka', category: 'Appetizers', menuType: 'Engagement Menu', price: 170, isVegetarian: true, description: 'Tandoor-grilled button mushrooms in spiced yogurt marinade', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&w=800&q=80' },
        { name: 'Corn Cheese Balls', category: 'Appetizers', menuType: 'Engagement Menu', price: 140, isVegetarian: true, description: 'Crispy golden balls of sweet corn & melting mozzarella', spiceLevel: 'Mild', preparationTime: 15, image: 'https://images.unsplash.com/photo-1626601460394-a29953ad7636?auto=format&fit=crop&w=800&q=80' },
        { name: 'Dahi Kebab', category: 'Appetizers', menuType: 'Engagement Menu', price: 150, isVegetarian: true, description: 'Melt-in-mouth hung curd patties, crispy outside, creamy inside', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1600720445353-8328bf372138?auto=format&fit=crop&w=800&q=80' },
        { name: 'Paneer Chilli', category: 'Main Course', menuType: 'Engagement Menu', price: 190, isVegetarian: true, description: 'Indo-Chinese style paneer tossed with peppers & onions in chilli sauce', spiceLevel: 'Hot', preparationTime: 20, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80' },
        { name: 'Gobi Manchurian', category: 'Main Course', menuType: 'Engagement Menu', price: 160, isVegetarian: true, description: 'Crispy cauliflower florets in a spicy garlic-soy glaze', spiceLevel: 'Hot', preparationTime: 25, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veg Fried Rice', category: 'Main Course', menuType: 'Engagement Menu', price: 150, isVegetarian: true, description: 'Wok-tossed basmati rice with colorful vegetables & aromatic soy', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veg Hakka Noodles', category: 'Main Course', menuType: 'Engagement Menu', price: 150, isVegetarian: true, description: 'Stir-fried noodles with crunchy julienned vegetables', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80' },
        { name: 'Spring Rolls', category: 'Appetizers', menuType: 'Engagement Menu', price: 130, isVegetarian: true, description: 'Crispy golden rolls packed with shredded vegetables & glass noodles', spiceLevel: 'Medium', preparationTime: 15, image: 'https://images.unsplash.com/photo-1544681280-d2dc0c1a6a3b?auto=format&fit=crop&w=800&q=80' },
        { name: 'Brownie with Ice Cream', category: 'Dessert', menuType: 'Engagement Menu', price: 160, isVegetarian: true, description: 'Warm fudgy walnut brownie topped with vanilla ice cream', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80' },
        { name: 'Mango Mousse', category: 'Dessert', menuType: 'Engagement Menu', price: 110, isVegetarian: true, description: 'Light & airy Alphonso mango mousse with a berry coulis', spiceLevel: 'None', preparationTime: 20, image: 'https://images.unsplash.com/photo-1505253507413-42671427502f?auto=format&fit=crop&w=800&q=80' },
        { name: 'Mini Desserts', category: 'Dessert', menuType: 'Engagement Menu', price: 160, isVegetarian: true, description: 'Elegant assortment of bite-sized sweet treats on a platter', spiceLevel: 'None', preparationTime: 20, image: 'https://images.unsplash.com/photo-1551024601-564d6d6745f7?auto=format&fit=crop&w=800&q=80' },
        { name: 'Stuffed Kulcha', category: 'Breads', menuType: 'Engagement Menu', price: 70, isVegetarian: true, description: 'Flaky tandoori bread stuffed with spiced potatoes & cheese', spiceLevel: 'Mild', preparationTime: 15, image: 'https://images.unsplash.com/photo-1630138541258-20412693ba67?auto=format&fit=crop&w=800&q=80' },

        // ═══════════════════════════════════════════
        // 5. CORPORATE MENU (15 items)
        // ═══════════════════════════════════════════
        { name: 'Executive Thali', category: 'Lunch', menuType: 'Corporate Menu', price: 200, isVegetarian: true, description: 'Complete wholesome thali with dal, sabzi, bread, rice & dessert', spiceLevel: 'Mild', preparationTime: 30, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
        { name: 'Sandwich Platter', category: 'Snacks', menuType: 'Corporate Menu', price: 150, isVegetarian: true, description: 'Assorted premium grilled & cold club sandwiches', spiceLevel: 'Mild', preparationTime: 15, image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veggie Sub', category: 'Lunch', menuType: 'Corporate Menu', price: 160, isVegetarian: true, description: 'Loaded submarine sandwich with fresh vegetables & sauces', spiceLevel: 'Mild', preparationTime: 10, image: 'https://images.unsplash.com/photo-1509722747741-092078eb1704?auto=format&fit=crop&w=800&q=80' },
        { name: 'Mini Wraps', category: 'Snacks', menuType: 'Corporate Menu', price: 130, isVegetarian: true, description: 'Bite-sized tortilla wraps with seasoned veggie filling', spiceLevel: 'Medium', preparationTime: 15, image: 'https://images.unsplash.com/photo-1616423668612-8e7c10b05b4e?auto=format&fit=crop&w=800&q=80' },
        { name: 'Grilled Chicken Salad', category: 'Lunch', menuType: 'Corporate Menu', price: 200, isVegetarian: false, description: 'Tender grilled chicken breast on a bed of fresh greens & vinaigrette', spiceLevel: 'Mild', preparationTime: 20, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80' },
        { name: 'Veg Biryani Box', category: 'Lunch', menuType: 'Corporate Menu', price: 170, isVegetarian: true, description: 'Individual boxed biryani meal with raita & mint chutney', spiceLevel: 'Medium', preparationTime: 20, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
        { name: 'Pasta Arrabiata Box', category: 'Lunch', menuType: 'Corporate Menu', price: 180, isVegetarian: true, description: 'Individual box of penne in spicy tomato-garlic sauce', spiceLevel: 'Medium', preparationTime: 25, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80' },
        { name: 'Curd Rice Box', category: 'Lunch', menuType: 'Corporate Menu', price: 110, isVegetarian: true, description: 'South Indian comfort food — tempered curd rice in a box', spiceLevel: 'Mild', preparationTime: 10, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80' },
        { name: 'Vegetable Puffs', category: 'Snacks', menuType: 'Corporate Menu', price: 50, isVegetarian: true, description: 'Flaky golden pastry puffs with spiced potato filling', spiceLevel: 'Medium', preparationTime: 15, image: 'https://images.unsplash.com/photo-1589301777240-5a7a7051d957?auto=format&fit=crop&w=800&q=80' },
        { name: 'Croissants', category: 'Breakfast', menuType: 'Corporate Menu', price: 90, isVegetarian: true, description: 'Buttery flaky French croissants, freshly baked', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' },
        { name: 'Muffin & Coffee Combo', category: 'Breakfast', menuType: 'Corporate Menu', price: 130, isVegetarian: true, description: 'Artisan blueberry muffin paired with freshly brewed filter coffee', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80' },
        { name: 'Chai & Biscuits', category: 'Snacks', menuType: 'Corporate Menu', price: 50, isVegetarian: true, description: 'Masala chai with premium assorted biscuit selection', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1555431189-0fabf2667795?auto=format&fit=crop&w=800&q=80' },
        { name: 'Fresh Fruit Bowl', category: 'Dessert', menuType: 'Corporate Menu', price: 90, isVegetarian: true, description: 'Seasonal fresh-cut fruits beautifully arranged', spiceLevel: 'None', preparationTime: 10, image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80' },
        { name: 'Walnut Brownie Box', category: 'Dessert', menuType: 'Corporate Menu', price: 100, isVegetarian: true, description: 'Rich fudgy walnut brownies in a premium gift box', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80' },
        { name: 'Fresh Juice Bottles', category: 'Beverages', menuType: 'Corporate Menu', price: 70, isVegetarian: true, description: 'Cold-pressed fresh fruit juices in individual glass bottles', spiceLevel: 'None', preparationTime: 5, image: 'https://images.unsplash.com/photo-1543573852-1a71a6ce19bc?auto=format&fit=crop&w=800&q=80' }
    ],

    testimonials: [
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
    ]
};

// Simple filtering helper
MOCK_DATA.filterMenu = (params) => {
    let results = MOCK_DATA.menuItems;
    if (params.menuType) {
        results = results.filter(item => item.menuType === params.menuType);
    }
    return results;
};
