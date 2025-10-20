import { Link } from "react-router-dom";
import { Truck, RotateCcw, Lock, MessageCircle } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Free shipping",
      desc: "Orders over $50",
      href: "/deals/free-shipping",
      colors: "from-blue-500 to-indigo-500",
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      title: "30-day returns",
      desc: "Hassle-free exchanges",
      href: "/deals/easy-returns",
      colors: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Secure checkout",
      desc: "256-bit SSL / PCI",
      href: "/payments",
      colors: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "24/7 support",
      desc: "Fast, friendly help",
      href: "/support",
      colors: "from-sky-500 to-blue-500",
    },
  ];

  const Item = ({ icon, title, desc, href, colors }) => (
    <Link
      to={href}
      aria-label={title}
      className={`group rounded-lg bg-gradient-to-r ${colors} p-[1px] 
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
    >
      <div className="flex items-center gap-3 rounded-lg bg-[#0b0e13] dark:bg-gray-900 px-3 py-2 sm:px-4 sm:py-3">
        <div
          className={`p-2 rounded-md bg-gradient-to-br ${colors} text-white grid place-items-center`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white group-hover:opacity-90">
            {title}
          </p>
          <p className="text-xs text-gray-300 group-hover:text-gray-200 truncate">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="my-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {items.map((it) => (
          <Item key={it.title} {...it} />
        ))}
      </div>
    </section>
  );
}
