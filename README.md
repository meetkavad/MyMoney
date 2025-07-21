# $ MyMoney - Personal Finance Management System

A modern, full-stack personal finance management application built with Next.js and Node.js. Track your income, expenses, and analyze your spending patterns with intuitive interface.

## 🌟 Features

### 💸 Transaction Management
- **Add Transactions**: Record income and expense transactions
- **Category System**: Organized spending with predefined categories
- **Search & Filter**: Find transactions with search and date range filters
- **Receipt Upload**: Extract transaction data from receipt images using OCR
- **Transaction History**: Import and process transaction history from documents

### 📊 Analytics & Insights
- **Visual Charts**: Interactive charts showing spending patterns
- **Date Range Analysis**: View transactions by different time periods
- **Category Breakdown**: Analyze spending by categories

### 🔒 Security & Authentication
- **User Registration & Login**: Secure user authentication
- **Protected Routes**: Secure access to personal financial data

### 📱 Modern UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Indian Locale**: Currency formatting in INR

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **Tailwind CSS 4** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Tesseract.js** - OCR for text extraction from images
- **OpenRouter AI** - AI-powered transaction processing


## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/meetkavad/MyMoney
   cd MyMoney
   ```

2. **Install dependencies for both client and server**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

### Configuration

3. **Set up OpenRouter API Key (for AI features)**

   - Visit [OpenRouter](https://openrouter.ai/settings/keys)
   - Create an account and generate a new API key

4. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/mymoney

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # Server Port
   PORT=5000

   # Email Configuration
   MAIL_ID = <your_mail_id>
   MAIL_PASSWORD = <app_password>

   # OpenRouter AI API
   OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key-here
   ```

   Create a `.env.local` file in the `client` directory:
   ```env
   # API Base URL
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Database Setup

5. **Start MongoDB**
   
   **Local MongoDB:**
   ```bash
   mongod
   ```

   **MongoDB Atlas:**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env`

### Running the Application

6. **Start the development servers**

   **Terminal 1 - Start Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

   **Terminal 2 - Start Frontend Application:**
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:3000`

7. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`
