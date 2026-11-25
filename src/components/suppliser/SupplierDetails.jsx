import {
  FiX,
  FiPackage,
  FiMapPin,
  FiStar,
  FiFileText,
  FiPhone,
  FiMail,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiHash,
  FiClock,
  FiMap,
} from "react-icons/fi";

// const supplier = {
//   id: 2,
//   code: "SUP-002",
//   name: "پخش نوشیدنی آریا",
//   category: "نوشیدنی",
//   contactPerson: "محمد کریمی",
//   mobile: "09131234562",
//   phone: "03132221002",
//   email: "orders@aria.example",
//   address: "اصفهان، خیابان کاوه، محدوده صنعتی",
//   city: "اصفهان",
//   province: "اصفهان",
//   postalCode: "8135678912",
//   description: "تأمین انواع نوشیدنی، آب معدنی و آبمیوه",
//   debt: 0,
//   paidAmount: 96000000,
//   totalPurchases: 96000000,
//   paymentTerm: "نقدی",
//   productsCount: 18,
//   rating: 4.5,
//   lastPurchaseDate: "1405/07/25",
//   startDate: "1404/05/10",
//   status: "active",
// };

const money = (value) =>
  new Intl.NumberFormat("fa-IR").format(value) + " تومان";

function Detail({ icon: Icon, label, value, ltr = false }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-2.5 last:border-0">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span
        dir={ltr ? "ltr" : "rtl"}
        className="break-words text-left text-sm font-semibold text-gray-800"
      >
        {value}
      </span>
    </div>
  );
}

function Section({ title, icon: Icon, children, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}
    >
      <div className="flex items-center gap-2.5 bg-gradient-to-l from-green-50 to-slate-50 px-4 py-3.5">
        <Icon size={19} className="text-emerald-600" />
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function SupplierDetailsDesign({ show, setShow, supplier }) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="my-auto flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* سربرگ */}
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-l from-slate-900 via-[#172b4d] to-slate-800 px-5 py-6 text-white sm:px-7 pb-10">
          <div className="absolute -left-12 -top-24 h-64 w-64 rounded-full bg-emerald-500/10" />
          <div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-lg">
                <FiPackage size={34} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-extrabold sm:text-2xl">
                  {supplier.name}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium">
                    {supplier.code}
                  </span>

                  <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    فعال
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <FiMapPin className="text-emerald-400" />
                  {supplier.province}، {supplier.city}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShow(!show);
              }}
              type="button"
              aria-label="بستن"
              className=" cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiX size={23} />
            </button>
          </div>

          <div className="absolute left-5 top-20 hidden items-center gap-2 rounded-xl bg-white/10 px-4 py-3 sm:flex">
            <FiStar size={25} className="fill-amber-400 text-amber-400" />
            <div>
              <p className="text-xl font-bold">{supplier.rating}</p>
              <p className="text-[11px] text-slate-300">امتیاز تأمین‌کننده</p>
            </div>
          </div>
        </header>

        {/* محتوای قابل اسکرول */}
        <main className="flex-1 space-y-5 overflow-y-auto bg-white p-4 sm:p-6">
          {/* خلاصه مالی */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCreditCard className="text-emerald-600" size={19} />
                مجموع خریدها
              </div>
              <p className="mt-3 text-lg font-extrabold text-slate-900">
                {money(supplier.totalPurchases)}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCheckCircle className="text-emerald-600" size={19} />
                مبلغ پرداخت‌شده
              </div>
              <p className="mt-3 text-lg font-extrabold text-emerald-700">
                {money(supplier.paidAmount)}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCreditCard className="text-rose-500" size={19} />
                بدهی باقی‌مانده
              </div>
              <p className="mt-3 text-lg font-extrabold text-rose-600">
                {money(supplier.debt)}
              </p>
            </div>
          </div>

          {/* اطلاعات در دو ستون */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <Section title="اطلاعات عمومی" icon={FiFileText}>
                <Detail
                  icon={FiHash}
                  label="شناسه تأمین‌کننده"
                  value={supplier.id}
                />
                <Detail
                  icon={FiHash}
                  label="کد تأمین‌کننده"
                  value={supplier.code}
                />
                <Detail
                  icon={FiPackage}
                  label="نام تأمین‌کننده"
                  value={supplier.name}
                />
                <Detail
                  icon={FiPackage}
                  label="دسته‌بندی"
                  value={supplier.category}
                />
                <Detail
                  icon={FiPackage}
                  label="تعداد محصولات تأمین‌شده"
                  value={`${supplier.productsCount} محصول`}
                />
                <Detail
                  icon={FiStar}
                  label="امتیاز تأمین‌کننده"
                  value={`${supplier.rating} از ۵`}
                />
                <Detail
                  icon={FiCalendar}
                  label="تاریخ شروع همکاری"
                  value={supplier.startDate}
                  ltr
                />
                <Detail
                  icon={FiCalendar}
                  label="آخرین خرید"
                  value={supplier.lastPurchaseDate}
                  ltr
                />
                <Detail icon={FiCheckCircle} label="وضعیت" value="فعال" />
              </Section>

              <Section title="شرایط همکاری" icon={FiCheckCircle}>
                <Detail
                  icon={FiClock}
                  label="شرایط پرداخت"
                  value={supplier.paymentTerm}
                />
                <Detail
                  icon={FiCreditCard}
                  label="وضعیت تسویه"
                  value={supplier.debt === 0 ? "تسویه کامل" : "دارای بدهی"}
                />
              </Section>
            </div>

            <div className="space-y-4">
              <Section title="اطلاعات مکانی" icon={FiMap}>
                <Detail
                  icon={FiMapPin}
                  label="استان"
                  value={supplier.province}
                />
                <Detail icon={FiMapPin} label="شهر" value={supplier.city} />
                <Detail
                  icon={FiMapPin}
                  label="آدرس کامل"
                  value={supplier.address}
                />
                <Detail
                  icon={FiHash}
                  label="کد پستی"
                  value={supplier.postalCode}
                  ltr
                />
              </Section>

              <Section title="اطلاعات تماس" icon={FiPhone}>
                <Detail
                  icon={FiUser}
                  label="نام مسئول ارتباط"
                  value={supplier.contactPerson}
                />
                <Detail
                  icon={FiPhone}
                  label="شماره موبایل"
                  value={supplier.mobile}
                  ltr
                />
                <Detail
                  icon={FiPhone}
                  label="تلفن ثابت"
                  value={supplier.phone}
                  ltr
                />
                <Detail
                  icon={FiMail}
                  label="ایمیل"
                  value={supplier.email}
                  ltr
                />
              </Section>

              <Section title="توضیحات" icon={FiFileText}>
                <div className="p-4 text-sm leading-8 text-slate-700">
                  {supplier.description}
                </div>
              </Section>
            </div>
          </div>
        </main>

        {/* پایین باکس */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <FiCalendar size={17} />
            <span>تاریخ شروع همکاری: {supplier.startDate}</span>
          </div>

          <button
            onClick={() => {
              setShow(!show);
            }}
            type="button"
            className="rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
          >
            بستن
          </button>
        </footer>
      </div>
    </div>
  );
}
