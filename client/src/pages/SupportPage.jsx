import { MessageCircle, Mail, PackageSearch, BookOpen } from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [messages, setMessages] = useState([
    { who: "agent", text: "Hi! How can we help today?" },
  ]);
  const [text, setText] = useState("");

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { who: "you", text: t }]);
    setText("");
    // (Optional) mock agent reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { who: "agent", text: "Thanks! An agent will be with you shortly." },
      ]);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg">
        <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
          <div className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl bg-white/15">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">We’re here 24/7</h1>
            <p className="text-white/90 mt-1">
              Chat, email, or browse help topics.
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a
          className="rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition flex items-center gap-3"
          href="/chat"
        >
          <MessageCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Live chat</p>
            <p className="text-sm text-gray-600">Start a conversation</p>
          </div>
        </a>
        <a
          className="rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition flex items-center gap-3"
          href="mailto:support@shop.dev"
        >
          <Mail className="w-5 h-5" />
          <div>
            <p className="font-semibold">Email support</p>
            <p className="text-sm text-gray-600">support@shop.dev</p>
          </div>
        </a>
        <a
          className="rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition flex items-center gap-3"
          href="/orders/track"
        >
          <PackageSearch className="w-5 h-5" />
          <div>
            <p className="font-semibold">Track order</p>
            <p className="text-sm text-gray-600">Find your package</p>
          </div>
        </a>
        <a
          className="rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition flex items-center gap-3"
          href="/help"
        >
          <BookOpen className="w-5 h-5" />
          <div>
            <p className="font-semibold">Help center</p>
            <p className="text-sm text-gray-600">FAQs & guides</p>
          </div>
        </a>
      </div>

      {/* Chat mock */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-bold mb-3">Live chat</h2>
          <div className="h-72 overflow-y-auto space-y-2 p-3 rounded-xl bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.who === "you"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2 outline-none focus:border-blue-400"
              placeholder="Type a message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn btn-primary" onClick={send}>
              Send
            </button>
          </div>
        </div>
        {/* Contact card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Contact</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:support@shop.dev"
                  className="text-blue-600 hover:underline"
                >
                  support@shop.dev
                </a>
              </p>
              <p>
                <span className="font-medium">Hours:</span> 24/7
              </p>
              <p>
                <span className="font-medium">Response:</span> within minutes
              </p>
            </div>
          </div>

          <a
            href="mailto:support@shop.dev"
            className="btn btn-primary w-full mt-3 py-2.5 text-center rounded-lg font-medium"
          >
            Email us
          </a>
        </div>
      </div>
    </div>
  );
}
