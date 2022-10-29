const data = {
  priceUnits:[
    {
      name:'US Dolar',
      sign:'$',
      unit:1,
      available:true,
      default:true
    },
    {
      name:'Iraqi Dinar',
      sign:'IQD',
      unit:1460,
      available:true,
    }
  ],
  languages: [
    {
      name: "کوردی",
      location: 0,
      direction: "rtl",
      description:'زمانی کوردی',
      logo:'',
      number:'Arabic',
      available:true,
      disabled:false,
      seq:10,
    },
    {
      name: "عربی",
      location: 1,
      direction: "rtl",
      description:'لغة العربیة',
      logo:'',
      number:'Arabic',
      available:true,
      disabled:false,
      default:false,
      seq:15
    },
    {
      name: "English",
      location: 2,
      direction: "ltr",
      description:'English Language',
      logo:'',
      number:'English',
      available:true,
      disabled:false,
      default:true,
      seq:20,
    },
    {
      name: "türk",
      location: 3,
      direction: "ltr",
      description:'türk dili',
      logo:'',
      number:'English',
      available:true,
      disabled:false,
      default:false,
      seq:25
    },
    {
      name: "فارسی",
      location: 4,
      direction: "rtl",
      description:'زبان فارسی',
      logo:'',
      number:'Arabic',
      available:true,
      disabled:false,
      default:false,
      seq:35
    },
    {
      name: "française",
      location: 5,
      direction: "ltr",
      description:'Langue française',
      logo:'',
      number:'English',
      available:true,
      disabled:false,
      default:false,
      seq:40
    },
    {
      name: "deutsche",
      location: 6,
      direction: "ltr",
      description:'deutsche Sprache',
      logo:'',
      number:'English',
      available:true,
      disabled:false,
      default:false,
      seq:45
    },
  ],
  products: [
    {
      name: "Nike Slim shirt",
      slug: "nike-slim-shirt",
      category: "Shirts",
      image: "/images/p1.jpg", // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "high quality shirt",
    },
    {
      name: "Adidas Fit Shirt",
      slug: "adidas-fit-shirt",
      category: "Shirts",
      image: "/images/p2.jpg",
      price: 250,
      countInStock: 20,
      brand: "Adidas",
      rating: 4.0,
      numReviews: 10,
      description: "high quality product",
    },
    {
      name: "Nike Slim Pant",
      slug: "nike-slim-pant",
      category: "Pants",
      image: "/images/p3.jpg",
      price: 25,
      countInStock: 15,
      brand: "Nike",
      rating: 4.5,
      numReviews: 14,
      description: "high quality product",
    },
    {
      name: "Adidas Fit Pant",
      slug: "adidas-fit-pant",
      category: "Pants",
      image: "/images/p4.jpg",
      price: 65,
      countInStock: 5,
      brand: "Puma",
      rating: 4.5,
      numReviews: 10,
      description: "high quality product",
    },
  ],
};
export default data;
