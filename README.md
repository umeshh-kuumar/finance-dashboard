# Finance Dashboard

A clean, responsive, and fully-featured finance dashboard application designed to provide users with an overview of their financial health, transaction records, and intelligent insights.

![Finance Dashboard](./public/finance-dashboard-preview.png)

## Overview

This project was built to demonstrate best practices in structuring a modern React application, managing state globally via the Context API, and designing a polished User Interface using Tailwind CSS. 

## Features

- **Summary Cards**: At-a-glance view of Total Balance, Total Income, and Total Expenses.
- **Transactions Table**: A comprehensive list of recent transactions with:
  - Global Search by Category or Amount 🔍
  - Filter by Type (Income / Expense) 🚦
  - Interactive Column Sorting (Date / Amount) ↕️
- **Interactive Charts**:
  - Balance Trend Line Chart to view progression over time 📈
  - Categorical Spending Bar Chart to identify top expenses 📊
- **Intelligent Insights**: Automated extraction of top spending categories, total processed items, and savings estimate.
- **Role-Based Simulated UI**:
  - Toggable Context between **Viewer** (read-only) and **Admin** (can add/edit/delete).
  - Admins have exclusive access to the `+ Add Transaction` button.
- **UI Polish & UX Features**:
  - Fully responsive grid layout across Mobile, Tablet, and Desktop displays.
  - Hover effects, shadow transitions, and modern glass-like components.
  - **Dark Mode Toggle**: First-class system & manual dark mode support utilizing Tailwind CSS classes. 🌙
  - **Local Storage Persistence**: State synchronization across refreshes for both transactions and active theme preferences. 💾

## Tech Stack

- **Frontend Framework**: React (Bootstrapped with Vite ⚡)
- **Styling & Layout**: Tailwind CSS v4
- **State Management**: React Context API
- **Data Visualization**: Recharts
- **Iconography**: Lucide React

## Getting Started / How to Run

1. **Clone the repository** (or download the source code).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open in Browser**:
   Open `http://localhost:5173` (or the port provided by Vite in your terminal) to view the application.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Charts.jsx        # Recharts implementations
│   ├── Insights.jsx      # AI Insights summary
│   ├── Navbar.jsx        # Top navigation & controls
│   ├── SummaryCards.jsx  # Overview metric cards
│   └── TransactionsTable.jsx # Interactive data table
├── context/
│   └── AppContext.jsx    # Global State definition
├── data/
│   └── mockData.js       # Seed data
├── pages/
│   └── Dashboard.jsx     # Main layout aggregation
├── App.jsx               # Application entry container
├── index.css             # Base Tailwind configurations
└── main.jsx              # React DOM mounting
```
