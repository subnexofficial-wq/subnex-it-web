"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FiTrash2, FiPlus, FiUploadCloud, FiLoader } from "react-icons/fi";

export default function SliderManager() {
  const [sliders, setSliders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState("");

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const fetchSliders = async () => {
    const res = await fetch("/api/admin/sliders");
    const data = await res.json();
    setSliders(data);
  };

  useEffect(() => { fetchSliders(); }, []);

  // --- ImgBB তে ইমেজ আপলোড ফাংশন ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // ImgBB API তে পাঠানো হচ্ছে
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url;
        // আপলোড সফল হলে আমাদের API তে সেভ করা হচ্ছে
        await saveSliderToDB(imageUrl);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const saveSliderToDB = async (imageUrl) => {
    const res = await fetch("/api/admin/sliders", {
      method: "POST",
      body: JSON.stringify({ image: imageUrl, alt: altText || "Slider Image" }),
    });

    if (res.ok) {
      setAltText("");
      fetchSliders();
      Swal.fire({
        icon: "success",
        title: "Slider Added",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const deleteSlider = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        const res = await fetch(`/api/admin/sliders?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchSliders();
    }
  };

  return (
    <div className="p-8 container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase italic">Slider <span className="text-blue-600">Engine</span></h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Manage Homepage Visuals</p>
        </div>
      </div>
      
      {/* Upload Box */}
      <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm mb-10 text-center transition-all hover:border-blue-400">
        <div className="max-w-xs mx-auto space-y-4">
            <input 
                className="w-full border-b pb-1 mb-2 outline-none text-sm" 
                placeholder="Optional: Alt text (e.g. Winter Offer)" 
                value={altText} 
                onChange={e => setAltText(e.target.value)} 
            />
            
            <label className={`flex flex-col items-center justify-center cursor-pointer p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                {uploading ? <FiLoader className="animate-spin text-blue-600" size={30} /> : <FiUploadCloud className="text-blue-600" size={30} />}
                <span className="mt-2 text-xs font-bold uppercase text-gray-500">
                    {uploading ? "Uploading to Cloud..." : "Select Slider Image"}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Recommended size: 1920x800px (Max 5MB)</p>
        </div>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sliders.length === 0 && !uploading && (
            <p className="col-span-2 text-center text-gray-400 py-10 font-bold uppercase text-xs tracking-widest">No Sliders Found</p>
        )}
        {sliders.map(s => (
          <div key={s._id} className="relative group overflow-hidden rounded-[2rem] border border-gray-100 shadow-md h-48">
            <img src={s.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={s.alt} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                    onClick={() => deleteSlider(s._id)} 
                    className="bg-white text-red-600 p-4 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                >
                    <FiTrash2 size={20}/>
                </button>
            </div>
            <div className="absolute bottom-4 left-6">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-800">
                    {s.alt || "No Alt Text"}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}