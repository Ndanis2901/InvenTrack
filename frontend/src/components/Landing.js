import React from "react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-700">Pet Supplies Inventory Management System</h1>
          <a href="/login" className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition duration-300">
            Login
          </a>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-10 py-16">
        {/* Left Section - Full Page Image */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen">
        <img 
          src="/1.JPG" 
          alt="Pet Supplies Inventory" 
          className="w-[80%] h-[90%] rounded-3xl object-cover"
        />
      </div>

        {/* Right Section - Text & CTA */}
        <div className="w-full md:w-1/2 text-center md:text-left mt-10 md:mt-0">
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            Pet Supplies Management by <span className="text-red-500">True Animal Lover</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We transform your pet with care and expertise. Join us today!
          </p>

          <div className="mt-6">
            <a href="/schedule" className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition duration-300">
              Join Us
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 text-sm">
        &copy; 2024 Pet Supplies Inventory. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Landing;
