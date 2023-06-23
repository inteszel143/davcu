const MYCARDS = [
  {
    id: 1,

    name: "Cash on Delivery",
    subname: "Payment will be given when the order is delivered",
    icon: require("../../assets/images/cod2.png"),
  },
  {
    id: 2,
    name: "Gcash",
    subname: "Gcash account required",
    icon: require("../../assets/images/GCASH.png"),
  },
];

const Category = [
  {
    image: require('../../assets/Icons/suitcase.png'),
    name: 'Bags',
    subtitle: "Fashionable Bags for Modern Adventurers",
  },
  {
    image: require('../../assets/Icons/woman-clothes.png'),
    name: 'Tribal Costume',
    subtitle: "Where Tradition Comes Alive in Tribal Attire",
  },
  {
    image: require('../../assets/Icons/pearl-necklace.png'),
    name: 'Accessories',
    subtitle: "Elevate Your Wardrobe with Our Trendy Accessories",
  },
  {
    image: require('../../assets/Icons/vegetables.png'),
    name: 'Basket',
    subtitle: "Elevate Your Home with Our Artisan Baskets",
  },
  {
    image: require('../../assets/Icons/flip-flop.png'),
    name: 'Footwear',
    subtitle: "Beauty Handmade for Your Feet",
  },
  {
    image: require('../../assets/Icons/wallet.png'),
    name: 'Wallet',
    subtitle: "Unleash Your Imagination with Our Artistic Masterpieces",
  },
];

const HeaderData = [
  {
    name: "Products",
  },
  {
    name: "Category",
  }

]

export default {
  Category,
  MYCARDS,
  HeaderData,
};