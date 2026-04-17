export interface MenuItem {
  _id: string; // Optional MongoDB ID
  name: string;
  category: string;
  price: number;
  image: string;
}

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { 
    _id: "1",
    name: "Pilau", 
    category: "Meals", 
    price: 450, 
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    _id: "2",
    name: "Beef Stew", 
    category: "Meals", 
    price: 550, 
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
  },
  { 
    _id: "3",
    name: "Chicken Biryani", 
    category: "Meals", 
    price: 650, 
    image: "https://www.vecteezy.com/photo/68286635-explore-the-flavors-of-authentic-chicken-biryani",
  },
  { 
    _id: "4",
    name: "Black Forest Cake", 
    category: "Pastry", 
    price: 2500, 
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
  },
  { 
    _id: "5",
    name: " Veg Pizza", 
    category: "Special", 
    price: 1200, 
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
  },
  { 
    _id: "6",
    name: "Queen Cakes", 
    category: "Pastry", 
    price: 300, 
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80"
  },
];