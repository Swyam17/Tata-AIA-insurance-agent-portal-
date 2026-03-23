# 🛡️ Tata AIA Insurance Agent Portal

A comprehensive, high-performance web application designed for insurance advisors to streamline policy management, track business growth, and provide better service to customers. This portal empowers agents with real-time analytics, secure authentication, and a seamless policy issuance workflow.

![Tata AIA Insurance Agent Portal](https://raw.githubusercontent.com/your-username/your-repo-name/main/screenshots/hero.png)

## 🚀 Key Features

### 📊 Comprehensive Dashboard
*   **Real-time Metrics:** Track total policies, active status, total premium collected, and pending renewals at a glance.
*   **Interactive Analytics:** Visualize monthly business growth and plan distribution using dynamic Chart.js integration.
*   **Policy Date Tracker:** A visual timeline of key milestones, from issuance to maturity.

### 📝 Seamless Policy Issuance
*   **Step-by-Step Flow:** Intuitive form for collecting customer details and policy preferences.
*   **Benefits Predictor:** Built-in wealth calculator to estimate maturity value based on investment tenure and expected returns.
*   **Digital Signature:** Integrated signature pad for secure, paperless application signing.
*   **Payment Integration:** Supports multiple payment gateways including Google Pay, PhonePe, Paytm, UPI, and Card payments.

### 👤 Advisor Empowerment
*   **Agent Profile Management:** Maintain advisor credentials, IRDA license numbers, and branch details.
*   **Performance Tracking:** Monitor monthly policy sales and customer satisfaction ratings.
*   **Data Portability:** Export your policy database to CSV for offline analysis.

### 🔒 Security & Reliability
*   **Secure Authentication:** Multi-factor login system with "Forgot Password" flow and unique advisor IDs.
*   **Robust Backend:** Powered by Node.js and MongoDB for high availability and data integrity.
*   **Responsive Design:** Optimized for desktops, tablets, and mobile devices.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5 (Semantic), Vanilla CSS (Glassmorphism & Modern UI), Vanilla JS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Charts** | Chart.js |
| **Tools** | CORS, Nodemon |

## 📂 Project Structure

```bash
insurance/
├── public/                 # Frontend assets
│   ├── app.js              # Core frontend logic & API interaction
│   ├── index.html          # Main portal entry point
│   └── styles.css          # Premium design system & animations
├── server.js               # Express server & API routes
├── package.json            # Dependencies & scripts
└── .gitignore              # Files to exclude from Git
```

## ⚙️ Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v14+)
*   [MongoDB](https://www.mongodb.com/) (Running locally on `mongodb://localhost:27017/`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tata-aia-portal.git
    cd tata-aia-portal
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Access the portal:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Credentials
*   **User ID:** `admin123`
*   **Password:** `password123`

## 📈 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/policies` | Retrieve all policies (with search filter) |
| `POST` | `/api/policies` | Create a new policy |
| `GET` | `/api/policies/stats` | Get aggregate policy metrics |
| `PUT` | `/api/policies/:id` | Update policy status or details |
| `POST` | `/api/login` | Secure advisor authentication |
| `GET` | `/api/analytics` | Get data for growth & distribution charts |

## 📄 License

This project is licensed under the ISC License.

---

*Developed for the Tata AIA Insurance Ecosystem — Empowering Advisors, Protecting Families.*
