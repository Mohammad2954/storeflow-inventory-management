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

export default function SupplierEdit({
  changeShoeEdit,
  supplierEdit,
  state,
  dispatch,
}) {
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-medium text-slate-700";

  const handleChange = (e) => {
    dispatch({
      type: e.target.name,
      value: e.target.value,
    });
  };

  const fields = [
    {
      title: "اطلاعات عمومی",
      icon: FiPackage,
      items: [
        { label: "نام تأمین‌کننده", key: "name", icon: FiPackage },
        { label: "تاریخ شروع همکاری", key: "startDate", icon: FiCalendar },
      ],
    },
    {
      title: "اطلاعات تماس",
      icon: FiPhone,
      items: [
        { label: "نام مسئول ارتباط", key: "contactPerson", icon: FiUser },
        { label: "شماره موبایل", key: "mobile", icon: FiPhone },
        { label: "تلفن ثابت", key: "phone", icon: FiPhone },
        { label: "ایمیل", key: "email", icon: FiMail },
      ],
    },
    {
      title: "اطلاعات مکانی",
      icon: FiMapPin,
      items: [
        { label: "استان", key: "province", icon: FiMapPin },
        { label: "شهر", key: "city", icon: FiMapPin },
        { label: "کد پستی", key: "postalCode", icon: FiMapPin },
        {
          label: "آدرس کامل",
          key: "address",
          icon: FiMapPin,
          full: true,
        },
      ],
    },
  ];

  // مقدار فیلد از state و در غیر این صورت از supplierEdit خوانده می‌شود.
  const getValue = (key) => state?.[key] ?? supplierEdit?.[key] ?? "";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <header className="shrink-0 bg-gradient-to-l from-slate-900 via-[#172b4d] to-slate-800 px-5 py-6 text-white sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald-400">
                <FiEdit3 size={28} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold">ویرایش تأمین‌کننده</h2>

                <p className="mt-2 text-sm text-slate-300">
                  {getValue("name")}
                </p>

                <span className="mt-2 inline-block rounded-lg bg-white/10 px-3 py-1 text-xs">
                  {supplierEdit?.code}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={changeShoeEdit}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiX size={22} />
            </button>
          </div>
        </header>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(state);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <main className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
            {fields.map((section) => {
              const SectionIcon = section.icon;

              return (
                <section
                  key={section.title}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-l from-emerald-50 to-slate-50 px-4 py-3.5">
                    <SectionIcon size={19} className="text-emerald-600" />

                    <h3 className="text-sm font-bold text-slate-800">
                      {section.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
                    {section.items.map((field) => {
                      const FieldIcon = field.icon;

                      return (
                        <div
                          key={field.key}
                          className={field.full ? "sm:col-span-2" : ""}
                        >
                          <label htmlFor={field.key} className={labelClass}>
                            <FieldIcon size={16} className="text-emerald-600" />
                            {field.label}
                          </label>

                          {field.key === "address" ? (
                            <textarea
                              id={field.key}
                              name={field.key}
                              value={getValue(field.key)}
                              onChange={handleChange}
                              rows={2}
                              className={inputClass}
                            />
                          ) : (
                            <input
                              id={field.key}
                              name={field.key}
                              type={field.key === "email" ? "email" : "text"}
                              value={getValue(field.key)}
                              onChange={handleChange}
                              className={inputClass}
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* دسته‌بندی */}
                    {section.title === "اطلاعات عمومی" && (
                      <div>
                        <label htmlFor="category" className={labelClass}>
                          <FiPackage size={16} className="text-emerald-600" />
                          دسته‌بندی
                        </label>

                        <select
                          id="category"
                          name="category"
                          value={getValue("category")}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="نوشیدنی">نوشیدنی</option>
                          <option value="مواد غذایی">مواد غذایی</option>
                          <option value="لوازم مصرفی">لوازم مصرفی</option>
                          <option value="بهداشتی">بهداشتی</option>
                          <option value="سایر">سایر</option>
                        </select>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

            {/* شرایط همکاری */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-l from-emerald-50 to-slate-50 px-4 py-3.5">
                <FiCreditCard size={19} className="text-emerald-600" />

                <h3 className="text-sm font-bold text-slate-800">
                  شرایط همکاری
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 sm:p-5">
                <div>
                  <label htmlFor="paymentTerm" className={labelClass}>
                    <FiCreditCard size={16} className="text-emerald-600" />
                    شرایط پرداخت
                  </label>

                  <select
                    id="paymentTerm"
                    name="paymentTerm"
                    value={getValue("paymentTerm")}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="نقدی">نقدی</option>
                    <option value="7 روزه">7 روزه</option>
                    <option value="15 روزه">15 روزه</option>
                    <option value="30 روزه">30 روزه</option>
                    <option value="45 روزه">45 روزه</option>
                    <option value="60 روزه">60 روزه</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    <FiFileText size={16} className="text-emerald-600" />
                    توضیحات
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={getValue("description")}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
            <span className="text-xs text-slate-400">
              کد تأمین‌کننده: {supplierEdit?.code}
            </span>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={changeShoeEdit}
                className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                انصراف
              </button>

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                ذخیره تغییرات
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
