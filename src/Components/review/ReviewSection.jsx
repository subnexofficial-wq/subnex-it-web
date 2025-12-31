"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiStar, FiUpload, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  /* FORM STATE */
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  /* IMAGE STATE */
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD REVIEWS ================= */
  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    if (productId) loadReviews();
  }, [productId]);

  /* ================= FILE HANDLER ================= */
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    // ফাইল সাইজ চেক (ঐচ্ছিক - ৫এমবি লিমিট)
    if (f.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async () => {
    setError("");
    setSuccess("");

    if (!rating || !comment || !email) {
      setError("Rating, comment and email are required");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // ১. ইমেজি থাকলে ImgBB তে হোস্ট করা
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });

        const imgbbData = await imgbbRes.json();
        
        if (imgbbData.success) {
          imageUrl = imgbbData.data.url;
        } else {
          throw new Error("Failed to upload image to ImgBB");
        }
      }

      // ২. ব্যাকএন্ড API তে ডাটা পাঠানো
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment,
          userName: name,
          email,
          image: imageUrl, 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // ৩. সাকসেস হলে স্টেট রিসেট
      setSuccess("Review submitted successfully!");
      setShowForm(false);
      resetForm();
      loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setName("");
    setEmail("");
    setFile(null);
    setPreview(null);
  };

  const avg = reviews.length > 0 
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <section className="container mx-auto px-4 pb-16 mt-16">
      <h2 className="text-3xl font-bold text-center mb-12">Customer Reviews</h2>

      {/* SUMMARY SECTION */}
      <div className="grid md:grid-cols-3 gap-10 mb-10">
        <div className="text-center">
          <div className="flex justify-center gap-1 text-red-600 text-2xl">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} fill={i < Math.round(avg) ? "currentColor" : "none"} />
            ))}
          </div>
          <p className="mt-2 text-lg font-semibold">{avg} out of 5</p>
          <p className="text-sm text-gray-500">Based on {reviews.length} reviews</p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = reviews.filter((r) => r.rating === s).length;
            const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="flex text-red-600 w-20">
                  {[...Array(s)].map((_, i) => <FiStar key={i} size={14} fill="currentColor" />)}
                </div>
                <div className="flex-1 h-3 bg-gray-100 rounded">
                  <div className="h-full bg-red-600" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-sm w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-10 py-3 font-bold hover:bg-red-700 transition"
          >
            {showForm ? "Cancel Review" : "Write a Review"}
          </button>
        </div>
      </div>

      {/* REVIEW FORM */}
      {showForm && (
        <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded mb-16 shadow-inner">
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar
                key={s}
                size={32}
                onClick={() => setRating(s)}
                className={`cursor-pointer transition ${s <= rating ? "text-red-600 fill-red-600" : "text-gray-300"}`}
              />
            ))}
          </div>

          <input
            className="w-full border p-3 mb-4 rounded"
            placeholder="Review Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-3 mb-4 rounded"
            rows={4}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded bg-white">
            <label className="flex flex-col items-center cursor-pointer">
              <FiUpload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
            </label>
            {preview && (
              <div className="mt-4 relative w-full h-48 border rounded overflow-hidden">
                <Image src={preview} fill className="object-contain" alt="preview" />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-3 mb-4 rounded"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-3 mb-4 rounded"
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 mb-3 text-sm font-medium">⚠️ {error}</p>}
          {success && <p className="text-green-600 mb-3 text-sm font-medium">✅ {success}</p>}

          <button
            onClick={submitReview}
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 font-bold rounded flex justify-center items-center gap-2 disabled:bg-gray-400"
          >
            {loading && <FiLoader className="animate-spin" />}
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-10 border-t border-gray-200 pt-10">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="px-2 pb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex text-red-600 gap-1 mb-2">
                    {[...Array(r.rating)].map((_, i) => <FiStar key={i} size={14} fill="currentColor" />)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                      {r.userName?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="font-bold leading-none">{r.userName}</p>
                      {r.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold uppercase mt-1">
                          <FiCheckCircle size={10} /> Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="md:ml-12">
                <p className="font-bold text-lg mb-1">{r.title}</p>
                <p className="text-gray-700 leading-relaxed mb-4">{r.comment}</p>
                
                {/* যদি রিভিউতে ইমেজ থাকে তবে তা এখানে দেখাবে */}
                {r.image && (
                  <div className="relative w-32 h-32 rounded-lg border overflow-hidden mt-3 cursor-zoom-in">
                    <Image 
                      src={r.image} 
                      fill 
                      className="object-cover" 
                      alt="User review photo"
                      sizes="128px"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}