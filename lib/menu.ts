export interface MenuItem {
  name: string;
  category: string;
  price: string;
  image: string;
}

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { 
    name: "Pilau", 
    category: "Meals", 
    price: "KSh 450", 
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Beef Stew", 
    category: "Meals", 
    price: "KSh 550", 
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Chicken Biryani", 
    category: "Meals", 
    price: "KSh 650", 
    image: "https://www.vecteezy.com/photo/68286635-explore-the-flavors-of-authentic-chicken-biryani",
  },
  { 
    name: "Black Forest Cake", 
    category: "Pastry", 
    price: "KSh 2,500", 
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Veg Pizza", 
    category: "Special", 
    price: "KSh 1,200", 
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Queen Cakes", 
    category: "Pastry", 
    price: "KSh 300", 
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80"
  },
];