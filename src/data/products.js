// Product data — local images kept, extra boys/girls added via Unsplash
const products = [
  // ── BOYS ────────────────────────────────────────────────────────────
  // Boys T-shirts
  { id: 1, name: "Core White T-shirt", subtitle: "Regular", price: 720, category: "tshirts", image: "/images/cave0507.webp", gender: "men", badge: null },
  { id: 2, name: "Spikes Black T-shirt", subtitle: "", price: 720, category: "tshirts", image: "/images/cave0207.webp", gender: "men", badge: null },
  { id: 3, name: "Prime NavyBlue Polo", subtitle: "", price: 720, category: "tshirts", image: "/images/cave0636.webp", gender: "men", badge: null },
  { id: 14, name: "Olive Washed Tee", subtitle: "Relaxed fit", price: 680, category: "tshirts", image: "https://tse1.mm.bing.net/th/id/OIP.4eafAXuFiyjXBG0Mwx07igAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", gender: "men", badge: "New" },
  { id: 15, name: "Vintage Grey Tee", subtitle: "Oversized", price: 650, category: "tshirts", image: "https://tse2.mm.bing.net/th/id/OIP.xziVjAehqXe8noT4zHfkhgHaLH?r=0&w=564&h=846&rs=1&pid=ImgDetMain&o=7&rm=3", gender: "men", badge: null },
  { id: 16, name: "Slate Blue Graphic Tee", subtitle: "", price: 700, category: "tshirts", image: "https://www.billabong.com/cdn/shop/files/24A352502_DPB_OM-F.jpg?v=1745336258&width=825", gender: "men", badge: null },
  // Boys Hoodies
  { id: 11, name: "Brown Hoodie", subtitle: "", price: 900, category: "hoodies", image: "/images/WhatsApp Image 2026-04-03 at 12.04.27 AM.jpeg", gender: "men", badge: null },
  { id: 12, name: "Black SpiderMan Hoodie", subtitle: "", price: 900, category: "hoodies", image: "/images/wmremove-transformed (2).jpeg", gender: "men", badge: null },
  { id: 17, name: "Charcoal Zip Hoodie", subtitle: "Heavy cotton", price: 950, category: "hoodies", image: "https://joshuamohamed.com/cdn/shop/files/charcoal_zip_-_30822.jpg?v=1726958554", gender: "men", badge: "New" },
  { id: 18, name: "Navy Pullover Hoodie", subtitle: "", price: 880, category: "hoodies", image: "https://www.gap.com/webcontent/0060/346/917/cn60346917.jpg", gender: "men", badge: null },
  // Boys Polos
  { id: 10, name: "Prime NavyBlue Polo", subtitle: "", price: 720, category: "polos", image: "/images/cave0636.webp", gender: "men", badge: null },
  { id: 19, name: "Forest Green Polo", subtitle: "Slim fit", price: 740, category: "polos", image: "https://pilotquarters.com/cdn/shop/files/the-oshkosh-vfr-forest-green-polo-aop-polo-shirt-33430526722224.jpg?v=1699827997", gender: "men", badge: "New" },
  { id: 20, name: "Burgundy Classic Polo", subtitle: "", price: 720, category: "polos", image: "https://n.nordstrommedia.com/it/130f2041-840a-414c-91ec-e4661b495ae1.jpeg?h=368&w=240&dpr=2", gender: "men", badge: null },

  // ── GIRLS ───────────────────────────────────────────────────────────
  // Babytees
  { id: 4, name: "Monopoly NavyBlue BBT", subtitle: "Regular", price: 400, category: "babytees", image: "/images/9586FDC8-CBBB-4A32-AF85-CBD28D10C2A1.webp", gender: "women", badge: null },
  { id: 5, name: "Monopoly Red BBT", subtitle: "", price: 400, category: "babytees", image: "/images/cave0571.webp", gender: "women", badge: null },
  { id: 6, name: "Monopoly Pink BBT", subtitle: "", price: 400, category: "babytees", image: "/images/cave0713.webp", gender: "women", badge: null },
  { id: 21, name: "Lavender Crop BBT", subtitle: "Fitted", price: 420, category: "babytees", image: "https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/2025/MAY/21/kNJQQDFn_c871718441884a0596c6999b2807616c.jpg", gender: "women", badge: "New" },
  { id: 22, name: "Cream Lace-Trim BBT", subtitle: "", price: 450, category: "babytees", image: "https://dsh6y5eym1jrl.cloudfront.net/_next/image?url=https:%2F%2Fd166chel5lrjm5.cloudfront.net%2Fimages%2Fdetailed%2F110%2Fsadie-10765-3f.jpg&w=3840&q=100", gender: "women", badge: "Hot" },
  { id: 23, name: "Sage Green Ribbed BBT", subtitle: "Stretch cotton", price: 410, category: "babytees", image: "https://www.lulus.com/images/product/xlarge/10658781_2189616.jpg?w=560", gender: "women", badge: null },
  // Girls Tops
  { id: 7, name: "SquareNeck Short Sleeve Burgundy Top", subtitle: "", price: 360, category: "tops", image: "/images/cave0977.webp", gender: "women", badge: null },
  { id: 8, name: "Square Neck Long Sleeve Black Top", subtitle: "", price: 399, category: "tops", image: "/images/cave0996.webp", gender: "women", badge: null },
  { id: 9, name: "Square Neck Long Sleeve NavyBlue Top", subtitle: "", price: 360, category: "tops", image: "/images/cave0435.webp", gender: "women", badge: null },
  { id: 24, name: "Dusty Rose Puff Sleeve Top", subtitle: "Flowy", price: 380, category: "tops", image: "https://i.pinimg.com/originals/70/44/ef/7044efa3dbe9ca267bdf71bde92b1029.jpg", gender: "women", badge: "New" },
  { id: 25, name: "Ivory Off-Shoulder Top", subtitle: "", price: 390, category: "tops", image: "https://cdn3.lulus.com/images/product/xlarge/1934992_324222.jpg", gender: "women", badge: "Hot" },
  { id: 26, name: "Terracotta Ruched Top", subtitle: "Bodycon", price: 370, category: "tops", image: "https://tse4.mm.bing.net/th/id/OIP.R_8-0RRkqEH672HhTxW1AAHaJh?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", gender: "women", badge: null },
  // Girls Hoodies
  { id: 13, name: "Pink SpiderMan Hoodie", subtitle: "", price: 900, category: "hoodies", image: "/images/image.png", gender: "women", badge: null },
  { id: 27, name: "Blush Pink Oversized Hoodie", subtitle: "Cozy fleece", price: 870, category: "hoodies", image: "https://static.ftshp.digital/img/p/8/1/9/8/6/8/819868.jpg", gender: "women", badge: "New" },
  { id: 28, name: "Lilac Cropped Hoodie", subtitle: "", price: 840, category: "hoodies", image: "https://storage.googleapis.com/lulu-fanatics/product/89338/1280/lululemon-scuba-full-zip-cropped-hoodie-lilac-smoke-055325-474532.jpg", gender: "women", badge: "Hot" },
  { id: 29, name: "Caramel Zip-Up Hoodie", subtitle: "Half-zip", price: 890, category: "hoodies", image: "https://th.bing.com/th/id/R.473e4c0b905eba080da0fa131a7f3205?rik=OfYOMSKXMeLFVg&riu=http%3a%2f%2fwww.gymreapers.com%2fcdn%2fshop%2ffiles%2fCaramel_CroppedHoodie1.jpg%3fv%3d1705597663%26width%3d2048&ehk=IWkT8bwZ2fIyxodhR0jf5qX%2bnVa%2bjdbonu8bj%2b6C6Ew%3d&risl=&pid=ImgRaw&r=0", gender: "women", badge: null },
];

export const categories = [
  { id: "all",      label: "All" },
  { id: "tshirts",  label: "T-shirts" },
  { id: "babytees", label: "Babytees" },
  { id: "tops",     label: "Tops" },
  { id: "polos",    label: "Polos" },
  { id: "hoodies",  label: "Hoodies" },
];

export default products;
