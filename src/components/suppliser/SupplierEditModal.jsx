import {
  FiX,
  FiPackage,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiEdit3,
} from "react-icons/fi";
function SupplierEditModal({ changeShoeEdit, state, dispatch, sendEdit }) {
  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";

  const labelClass = "mb-2 block text-sm font-medium text-gray-700";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FiEdit3 size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                ویرایش تأمین‌کننده
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                اطلاعات تأمین‌کننده را ویرایش کنید
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={changeShoeEdit}
            className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 overflow-y-auto p-6">
          {/* اطلاعات عمومی */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <FiPackage size={20} />
              </div>
              <h3 className="font-bold text-gray-800">اطلاعات عمومی</h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>نام تأمین‌کننده</label>
                <input
                  value={state.name}
                  onChange={(event) => {
                    dispatch({ type: "name", value: event.target.value });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>کد تأمین‌کننده</label>
                <input type="text" className={inputClass} disabled />
              </div>

              <div>
                <label className={labelClass}>تاریخ شروع همکاری</label>
                <input
                  value={state.startDate}
                  onChange={(event) => {
                    dispatch({ type: "startDate", value: event.target.value });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>دسته‌بندی تأمین‌کننده</label>
                <select
                  value={state.category}
                  onChange={(event) => {
                    dispatch({ type: "category", value: event.target.value });
                  }}
                  className={inputClass}
                >
                  <option>نوشیدنی</option>
                  <option>مواد غذایی</option>
                  <option>لوازم مصرفی</option>
                  <option>بهداشتی</option>
                  <option>سایر</option>
                </select>
              </div>
            </div>
          </section>

          {/* اطلاعات تماس */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <FiPhone size={20} />
              </div>
              <h3 className="font-bold text-gray-800">اطلاعات تماس</h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>نام مسئول ارتباط</label>
                <input
                  value={state.contactPerson}
                  onChange={(event) => {
                    dispatch({
                      type: "contactPerson",
                      value: event.target.value,
                    });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>شماره موبایل</label>
                <input
                  value={state.mobile}
                  onChange={(event) => {
                    dispatch({ type: "mobile", value: event.target.value });
                  }}
                  type="tel"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>تلفن ثابت</label>
                <input
                  value={state.phone}
                  onChange={(event) => {
                    dispatch({ type: "phone", value: event.target.value });
                  }}
                  type="tel"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>ایمیل</label>
                <input
                  value={state.email}
                  onChange={(event) => {
                    dispatch({ type: "email", value: event.target.value });
                  }}
                  type="email"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* اطلاعات مکانی */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <FiMapPin size={20} />
              </div>
              <h3 className="font-bold text-gray-800">اطلاعات مکانی</h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>استان</label>
                <input
                  value={state.province}
                  onChange={(event) => {
                    dispatch({ type: "province", value: event.target.value });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>شهر</label>
                <input
                  value={state.city}
                  onChange={(event) => {
                    dispatch({ type: "city", value: event.target.value });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>کد پستی</label>
                <input
                  value={state.postalCode}
                  onChange={(event) => {
                    dispatch({ type: "postalCode", value: event.target.value });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>آدرس کامل</label>
                <input
                  value={state.address}
                  onChange={(event) => {
                    dispatch({ type: "address", value: event.target.value });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* اطلاعات همکاری و پرداخت */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <FiCreditCard size={20} />
              </div>
              <h3 className="font-bold text-gray-800">
                اطلاعات همکاری و پرداخت
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>شرایط پرداخت</label>
                <select
                  value={state.paymentTerm}
                  onChange={(event) => {
                    dispatch({
                      type: "paymentTerm",
                      value: event.target.value,
                    });
                  }}
                  className={inputClass}
                >
                  <option>نقدی</option>
                  <option>7 روزه</option>
                  <option>15 روزه</option>
                  <option>30 روزه</option>
                  <option>45 روزه</option>
                  <option>60 روزه</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>وضعیت تأمین‌کننده</label>
                <select
                  value={state.status}
                  onChange={(event) => {
                    dispatch({ type: "status", value: event.target.value });
                  }}
                  className={inputClass}
                >
                  <option>فعال</option>
                  <option>غیرفعال</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>امتیاز تأمین‌کننده</label>
                <input
                  value={state.rating}
                  onChange={(event) => {
                    dispatch({ type: "rating", value: event.target.value });
                  }}
                  type="text"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* توضیحات */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <FiFileText size={20} />
              </div>
              <h3 className="font-bold text-gray-800">توضیحات</h3>
            </div>

            <textarea
              value={state.description}
              onChange={(event) => {
                dispatch({ type: "description", value: event.target.value });
              }}
              rows={4}
              placeholder="توضیحات مربوط به تأمین‌کننده..."
              className={`${inputClass} resize-none`}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={changeShoeEdit}
            className="cursor-pointer rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            انصراف
          </button>

          <button
            onClick={() => {
              sendEdit();
            }}
            type="button"
            className="cursor-pointer rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplierEditModal;
