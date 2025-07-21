import {
  DollarSign,
  TrendingUp,
  PieChart,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-neutral-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-20 mb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <div className="text-center w-full">
            <div className="mb-10 w-full">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-neutral-900">
                Track Your <span className="text-teal-400">Finances</span>{" "}
                Simply
              </h1>
              <p className="text-lg md:text-xl mb-8 leading-relaxed text-neutral-500 max-w-2xl mx-auto">
                A clean, intuitive personal finance tracker. Manually record
                transactions, upload receipts, visualize spending patterns, and
                take control of your money with our minimalist dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
              <Link href="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 text-sm mt-8 text-neutral-400 justify-center items-center">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No Subscriptions</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Your Data Stays Private</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free Forever Plan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
              Simple tools for smart money management
            </h2>
            <p className="text-lg text-neutral-500 max-w-lg mx-auto">
              Everything you need to track expenses, monitor income, and
              understand your spending
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 justify-items-center">
            <Card className="text-center w-full max-w-sm">
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-teal-50 mx-auto">
                <TrendingUp className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                Transaction Tracking
              </h3>
              <p className="text-neutral-500">
                Manually add income and expenses with categories. Upload
                receipts to extract transaction data automatically and keep
                track of every penny.
              </p>
            </Card>

            <Card className="text-center w-full max-w-sm">
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-teal-50 mx-auto">
                <PieChart className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                Visual Analytics
              </h3>
              <p className="text-neutral-500">
                View your spending patterns with beautiful charts and graphs.
                Filter by date ranges and see where your money goes with
                colorful category breakdowns.
              </p>
            </Card>

            <Card className="text-center w-full max-w-sm">
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-teal-50 mx-auto">
                <Shield className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                Personal & Secure
              </h3>
              <p className="text-neutral-500">
                Your financial data is stored securely with user authentication.
                Edit your profile, search transactions, and manage your money
                with confidence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-lg mx-auto">
          <Card className="text-center p-10 bg-gradient-to-br from-teal-400 to-teal-600">
            <h2 className="text-3xl font-bold mb-3 text-white">
              Ready to start tracking?
            </h2>
            <p className="text-lg mb-5 text-white/90">
              Take control of your finances with simple transaction tracking.
            </p>
            <Link href="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-teal-400"
              >
                Join MyMoney Now
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-neutral-200 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 mr-2 text-teal-400" />
              <span className="text-lg font-bold text-neutral-900">
                My<span className="text-teal-400">Money</span>
              </span>
            </div>
            <p className="text-neutral-500 text-sm">
              © 2025 MyMoney. All rights reserved. Built with ❤️ for better
              financial health.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
