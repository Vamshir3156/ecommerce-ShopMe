// client/src/components/TrustBar.jsx
export default function TrustBar() {
  const items = [
    {
      icon: "🚚",
      title: "Free shipping",
      desc: "Orders over $50",
      colors: "from-blue-500 to-indigo-500",
    },
    {
      icon: "↩️",
      title: "30-day returns",
      desc: "Hassle-free exchanges",
      colors: "from-emerald-500 to-teal-500",
    },
    {
      icon: "🔒",
      title: "Secure checkout",
      desc: "256-bit SSL / PCI",
      colors: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: "💬",
      title: "24/7 support",
      desc: "Fast, friendly help",
      colors: "from-sky-500 to-blue-500",
    },
  ];

  const Item = ({ icon, title, desc, colors }) => (
    <div
      className={`rounded-2xl p-[1px] bg-gradient-to-r ${colors} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all`}
    >
      <div className="rounded-2xl bg-white dark:bg-gray-900 px-4 py-3 flex items-center gap-4">
        {/* icon chip */}
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl text-white bg-gradient-to-br ${colors} shadow-sm`}
          aria-hidden
        >
          {icon}
        </div>
        {/* text */}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="my-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {items.map((it) => (
          <Item key={it.title} {...it} />
        ))}
      </div>
    </section>
  );
}
