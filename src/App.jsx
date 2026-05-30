/**
 * Student: hpr7339
 * File: App.jsx
 * Description: Root component for CabsOnline Part 2 React application.
 *              Manages navigation between four main views:
 *              Booking (with map), Driver Service, Customer Monitor, Payment.
 */

import { useState } from "react";
import BookingMap from "./components/BookingMap";
import DriverService from "./components/DriverService";
import CustomerMonitor from "./components/CustomerMonitor";
import Payment from "./components/Payment";
import "./App.css";

/**
 * App()
 * Root component. Renders the top navigation and the currently active view.
 * @returns {JSX.Element}
 */
export default function App() {
  const [activeTab, setActiveTab] = useState("booking");

  const tabs = [
    { id: "booking",  label: "📍 Book & Map" },
    { id: "drivers",  label: "🚖 Drivers" },
    { id: "monitor",  label: "📡 Monitor" },
    { id: "payment",  label: "💳 Payment" },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          Cabs<span>Online</span>
          <sup className="logo-badge">2.0</sup>
        </div>
        <nav className="app-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main view */}
      <main className="app-main">
        {activeTab === "booking"  && <BookingMap />}
        {activeTab === "drivers"  && <DriverService />}
        {activeTab === "monitor"  && <CustomerMonitor />}
        {activeTab === "payment"  && <Payment />}
      </main>
    </div>
  );
}
