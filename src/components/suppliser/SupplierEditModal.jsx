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

const supplier = {
  name: "پخش نوشیدنی آریا",
  code: "SUP-002",
  category: "نوشیدنی",
  contactPerson: "محمد کریمی",
  mobile: "09131234562",
  phone: "03132221002",
  email: "orders@aria.example",
  province: "اصفهان",
  city: "اصفهان",
  address: "اصفهان، خیابان کاوه، محدوده صنعتی",
  postalCode: "8135678912",
  paymentTerm: "نقدی",
  startDate: "1404/05/10",
  description: "تأمین انواع نوشیدنی، آب معدنی و آبمیوه",
};

function Field({ label, value, icon: Icon, full = false }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
        {Icon && <Icon size={16} className="text-emerald-600" />}
        {label}
      </label>

      <input
        defaultValue={value}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-l from-emerald-50 to-slate-50 px-4 py-3.5">
        <Icon size={19} className="text-emerald-600" />
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
        {children}
      </div>
    </section>
  );
}

export default function SupplierEdit({ changeShoeEdit }) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-l from-slate-900 via-[#172b4d] to-slate-800 px-5 py-6 text-white sm:px-7">
          <div className="absolute -left-12 -top-20 h-56 w-56 rounded-full bg-emerald-500/10" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald-400">
                <FiEdit3 size={28} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold">ویرایش تأمین‌کننده</h2>
                <p className="mt-2 text-sm text-slate-300">{supplier.name}</p>
                <span className="mt-2 inline-block rounded-lg bg-white/10 px-3 py-1 text-xs text-slate-200">
                  {supplier.code}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                changeShoeEdit();
              }}
              className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiX size={22} />
            </button>
          </div>
        </header>

        {/* Form design */}
        <main className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
          <Section title="اطلاعات عمومی" icon={FiPackage}>
            <Field
              label="نام تأمین‌کننده"
              value={supplier.name}
              icon={FiPackage}
            />

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiPackage size={16} className="text-emerald-600" />
                دسته‌بندی
              </label>
              <select
                defaultValue={supplier.category}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                <option>نوشیدنی</option>
                <option>مواد غذایی</option>
                <option>لوازم مصرفی</option>
                <option>بهداشتی</option>
                <option>سایر</option>
              </select>
            </div>

            <Field
              label="تاریخ شروع همکاری"
              value={supplier.startDate}
              icon={FiCalendar}
            />
          </Section>

          <Section title="اطلاعات تماس" icon={FiPhone}>
            <Field
              label="نام مسئول ارتباط"
              value={supplier.contactPerson}
              icon={FiUser}
            />

            <Field
              label="شماره موبایل"
              value={supplier.mobile}
              icon={FiPhone}
            />

            <Field label="تلفن ثابت" value={supplier.phone} icon={FiPhone} />

            <Field label="ایمیل" value={supplier.email} icon={FiMail} />
          </Section>

          <Section title="اطلاعات مکانی" icon={FiMapPin}>
            <Field label="استان" value={supplier.province} icon={FiMapPin} />

            <Field label="شهر" value={supplier.city} icon={FiMapPin} />

            <Field
              label="کد پستی"
              value={supplier.postalCode}
              icon={FiMapPin}
            />

            <Field
              label="آدرس کامل"
              value={supplier.address}
              icon={FiMapPin}
              full
            />
          </Section>

          <Section title="شرایط همکاری" icon={FiCreditCard}>
            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiCreditCard size={16} className="text-emerald-600" />
                شرایط پرداخت
              </label>
              <select
                defaultValue={supplier.paymentTerm}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                <option>نقدی</option>
                <option>7 روزه</option>
                <option>15 روزه</option>
                <option>30 روزه</option>
                <option>45 روزه</option>
                <option>60 روزه</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiFileText size={16} className="text-emerald-600" />
                توضیحات
              </label>
              <textarea
                defaultValue={supplier.description}
                rows={3}
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </Section>
        </main>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <span className="text-xs text-slate-400">
            کد تأمین‌کننده: {supplier.code}
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => {
                changeShoeEdit();
              }}
              className="rounded-xl cursor-pointer border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              انصراف
            </button>

            <button className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
              ذخیره تغییرات
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
