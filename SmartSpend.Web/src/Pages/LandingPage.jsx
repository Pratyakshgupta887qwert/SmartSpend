import { Receipt, BarChart3, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 shadow-sm">

        <h1 className="text-2xl font-bold text-blue-600">
          SmartSpend
        </h1>

        <div className="flex gap-8 items-center">

          <a href="#features" className="text-gray-600 hover:text-blue-600">
            Features
          </a>

          <a href="#how" className="text-gray-600 hover:text-blue-600">
            How it works
          </a>

          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </div>

      </nav>


      {/* HERO SECTION */}
      <section className="text-center px-10 py-28 bg-gray-50">

        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Track Your Expenses Smarter
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload receipts, monitor spending, and manage your finances
          effortlessly with SmartSpend — your intelligent expense tracker.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 hover:scale-105 transition duration-300 shadow-md"
        >
          Get Started
        </button>

      </section>


      {/* DASHBOARD PREVIEW IMAGE */}
      <section className="flex justify-center px-10 pb-24">

        <div className="shadow-xl rounded-2xl overflow-hidden hover:scale-105 transition duration-300">

          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="Dashboard Preview"
            className="w-[750px]"
          />

        </div>

      </section>


      {/* FEATURES */}
      <section id="features" className="py-20 px-10 bg-gray-50">

        <h2 className="text-3xl font-bold text-center mb-14">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">

            <Receipt className="mx-auto mb-4 text-blue-600" size={40} />

            <h3 className="text-xl font-semibold mb-2">
              Upload Receipts
            </h3>

            <p className="text-gray-600">
              Upload receipts instantly and track expenses automatically.
            </p>

          </div>


          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">

            <BarChart3 className="mx-auto mb-4 text-blue-600" size={40} />

            <h3 className="text-xl font-semibold mb-2">
              Spending Insights
            </h3>

            <p className="text-gray-600">
              Understand your spending patterns with visual analytics.
            </p>

          </div>


          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">

            <Wallet className="mx-auto mb-4 text-blue-600" size={40} />

            <h3 className="text-xl font-semibold mb-2">
              Budget Tracking
            </h3>

            <p className="text-gray-600">
              Stay within your budget and manage your finances easily.
            </p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-10 text-center">

        <h2 className="text-3xl font-bold mb-14">
          How SmartSpend Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Upload Receipt
            </h3>
            <p className="text-gray-600">
              Upload your receipt photo in seconds.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              AI Extracts Data
            </h3>
            <p className="text-gray-600">
              Smart AI extracts merchant and expense details.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Track Spending
            </h3>
            <p className="text-gray-600">
              Monitor expenses through your dashboard.
            </p>
          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-500 border-t">

        SmartSpend © 2026

      </footer>

    </div>
  );
}

export default LandingPage;