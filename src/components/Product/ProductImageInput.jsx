import { useEffect, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

function ProductImageInput({ onImageChange }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفاً یک فایل تصویری انتخاب کنید.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم تصویر نباید بیشتر از ۲ مگابایت باشد.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
    onImageChange(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="w-full p-4">
      <div className="relative">
        <label
          htmlFor="product-image"
          className="flex h-44 cursor-pointer flex-col items-center
          justify-center gap-3 rounded-xl border-2 border-dashed
          border-gray-300 bg-gray-50 dark:bg-gray-700 transition hover:border-green-500
          hover:bg-green-50"
        >
          {preview ? (
            <img
              src={preview}
              alt="پیش‌نمایش محصول"
              className="h-full w-full rounded-xl object-contain p-2"
            />
          ) : (
            <>
              <FiUploadCloud size={36} className="text-green-600" />

              <span className="text-sm text-gray-700">
                برای انتخاب تصویر کلیک کنید
              </span>

              <span className="text-xs text-gray-400">
                PNG، JPG یا WEBP (حداکثر ۲ مگابایت)
              </span>
            </>
          )}
        </label>

        <input
          id="product-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />

        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute right-2 top-2 rounded-full
            bg-white p-2 text-red-600 shadow hover:bg-red-50"
            aria-label="حذف تصویر"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductImageInput;
