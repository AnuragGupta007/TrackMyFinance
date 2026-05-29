# TrackMyFinance 🚀

**TrackMyFinance** is a full-stack Personal Finance Management SaaS application. It empowers users to take control of their financial health through intuitive expense tracking, budget management, and intelligent data insights. 

Built with the modern **MERN stack** (MongoDB, Express, React, Node.js), TrackMyFinance does more than just record numbers—it actively helps users understand their spending habits and automatically parses data from physical receipts using multimodal AI.

## ✨ Key Features

- **📊 Comprehensive Dashboard:** Visualize cash flow, category breakdowns, and spending trends using interactive charts (Recharts).
- **🤖 Smart Financial Advisor:** Analyzes the user's past 3 months of financial data to deliver personalized, actionable spending recommendations.
- **📸 Intelligent Receipt Scanner:** Uses vision capabilities to scan physical receipts, automatically extracting the merchant name, total amount, and matching it to the correct user category.
- **💰 Budget & Goal Tracking:** Set monthly budgets per category and track long-term savings goals with progress indicators.
- **🔐 Secure Authentication:** Fully secured with JWT (JSON Web Tokens) and password hashing (bcryptjs).
- **📱 Responsive UI:** A beautiful, responsive interface styled with Tailwind CSS, ensuring a seamless experience across desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Integrations:** Google Generative AI API (for text & vision insights)
- **Authentication:** JWT (JSON Web Tokens)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (MongoDB Atlas)
- Google AI Studio API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/TrackMyFinance.git
   cd TrackMyFinance
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Environment Setup:**
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Application:**
   Start both the frontend and backend servers concurrently:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (Client) and `http://localhost:5000` (API).

## 💡 Use Case & Impact
TrackMyFinance solves the manual burden of personal accounting. By automating data entry via image processing and providing contextual advice rather than static numbers, it acts as a personal financial assistant tailored to the user's real-life spending habits.

---
*Designed and built by [Your Name]*
