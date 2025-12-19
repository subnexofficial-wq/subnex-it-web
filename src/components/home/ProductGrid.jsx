// src/components/home/ProductGrid.jsx
import Image from "next/image";
import { FaStar } from "react-icons/fa";

const products = [
  { id: 1, title: "Netflix Subscription (TV Plan+All Device)", image: "/products/p1.jpg", rating: 5, reviews: 21, price: "From Tk 450.00 BDT", buttonText: "Choose options" },
  { id: 2, title: "Netflix+Prime Video Combo (Mobile/PC/Laptop)", image: "/products/p2.jpg", rating: 5, reviews: 42, price: "Tk 390.00 BDT", buttonText: "Add to cart" },
  { id: 3, title: "Netflix+Prime Video Combo (TV Plan+All Device)", image: "/products/p3.jpg", rating: 5, reviews: 22, price: "From Tk 490.00 BDT", buttonText: "Choose options" },
  { id: 4, title: "ChatGPT Plus Subscription", image: "/products/p4.jpg", rating: 5, reviews: 14, price: "From Tk 400.00 BDT", buttonText: "Choose options" },
  { id: 5, title: "Tinder Gold Subscription", image: "/products/p5.jpg", rating: 4, reviews: 10, price: "From Tk 890.00 BDT", buttonText: "Choose options" },
  { id: 6, title: "Apple Music Premium", image: "/products/p6.jpg", rating: 5, reviews: 1, price: "From Tk 350.00 BDT", buttonText: "Choose options" },
  { id: 7, title: "Zee5 Subscription", image: "/products/p7.jpg", rating: 5, reviews: 2, price: "Tk 1,800.00 BDT", buttonText: "Add to cart" },
  { id: 8, title: "iQIYI VIP Subscription", image: "/products/p8.jpg", rating: 5, reviews: 5, price: "From Tk 360.00 BDT", buttonText: "Choose options" },
  { id: 9, title: "Apple iTunes Gift Card", image: "/products/p9.jpg", rating: 5, reviews: 3, price: "From Tk 750.00 BDT", buttonText: "Choose options" },
  { id: 10, title: "Spotify Premium", image: "/products/p10.jpg", rating: 5, reviews: 50, price: "From Tk 150.00 BDT", buttonText: "Choose options" },
  { id: 11, title: "YouTube Premium", image: "/products/p11.jpg", rating: 5, reviews: 30, price: "From Tk 200.00 BDT", buttonText: "Choose options" },
  { id: 12, title: "Canva Pro", image: "/products/p12.jpg", rating: 5, reviews: 15, price: "Tk 100.00 BDT", buttonText: "Add to cart" },
  { id: 13, title: "Amazon Prime Video", image: "/products/p13.jpg", rating: 4, reviews: 8, price: "From Tk 250.00 BDT", buttonText: "Choose options" },
  { id: 14, title: "Hoichoi Subscription", image: "/products/p14.jpg", rating: 5, reviews: 12, price: "From Tk 300.00 BDT", buttonText: "Choose options" },
];

const ProductGrid = () => {
  return (
    <div className="w-full py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          
          {products.map((product) => (
            // ১. p-3 সরানো হয়েছে
            // ২. border-gray-800 রাখা হয়েছে
            <div 
              key={product.id} 
              className="group flex flex-col items-center bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-gray-500 transition-colors duration-300"
            >
              
              {/* ইমেজ সেকশন */}
              {/* হাইট কমানোর জন্য aspect-[2/3] থেকে aspect-[3/4] করা হয়েছে */}
              <div className="relative w-full aspect-[3/4] bg-gray-900">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* টেক্সট কন্টেন্ট (এখানে প্যাডিং দেওয়া হয়েছে যাতে লেখা বর্ডারের সাথে লেগে না যায়) */}
              <div className="w-full p-3 flex flex-col items-center text-center">
                
                {/* টাইটেল */}
                <h3 className="text-white text-xs md:text-sm font-medium leading-snug min-h-[35px] hover:text-red-500 transition-colors cursor-pointer line-clamp-2">
                  {product.title}
                </h3>

                {/* রেটিং */}
                <div className="flex items-center gap-1 my-1.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={10}
                      className={i < product.rating ? "text-white" : "text-gray-600"}
                    />
                  ))}
                  <span className="text-gray-400 text-[10px] ml-1">({product.reviews})</span>
                </div>

                {/* দাম */}
                <p className="text-white font-bold text-sm mb-3">
                  {product.price}
                </p>

                {/* বাটন */}
                <button className="w-full border border-gray-600 text-white py-2 rounded-[4px] text-[10px] md:text-xs font-bold hover:border-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider">
                  {product.buttonText}
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ProductGrid;