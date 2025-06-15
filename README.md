# 🛒 BlinkMart Client

Welcome to **BlinkMart Client** – a modern, responsive, and feature-rich e-commerce frontend built with React. This project powers the customer-facing side of the BlinkMart online shopping platform, offering a seamless and delightful shopping experience.

---

## 🚀 Features

- **Modern UI/UX**: Clean, mobile-first design with smooth transitions and intuitive navigation.
- **Authentication**: Secure login, registration, and session management.
- **Product Search & Filtering**: Lightning-fast search, category browsing, and smart filters.
- **Cart & Checkout**: Persistent cart, quantity management, and streamlined checkout flow.
- **Multiple Payment Methods**: Razorpay integration, Cash on Delivery, and robust payment status handling.
- **Order Management**: View order history, order details, and download invoices.
- **User Dashboard**: Quick access to profile, orders, wishlist, and more.
- **Wishlist**: Save your favorite products for later.
- **Responsive Design**: Looks stunning on all devices.
- **Notifications**: Real-time feedback with toasts and alerts.

---

## 🖼️ Screenshots

<p align="center">
  <img src="https://user-images.githubusercontent.com/your-username/blinkmart-client-demo.gif" alt="BlinkMart Demo" width="700"/>
</p>

---

## 🏗️ Tech Stack

- **React** (with Hooks & Context)
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Razorpay** for payments
- **Axios** for API requests
- **react-hot-toast** for notifications

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blinkmart-client.git
cd blinkmart-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add:

```env
VITE_APP_API_BASE_URL=https://your-api-url.com
VITE_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

### 4. Start the development server

```bash
npm run dev
```

The app will be running at [http://localhost:5173](http://localhost:5173) (or your configured port).

---

## 🗺️ Main Routes

- `/` – Home
- `/search` – Product Search
- `/cart` – Shopping Cart
- `/checkout` – Checkout
- `/dashboard` – User Dashboard
  - `/dashboard/my-orders` – My Orders
  - `/dashboard/profile` – Profile
  - `/dashboard/wishlist` – Wishlist

---

## 🛡️ Security & Best Practices

- All sensitive data is handled securely.
- Tokens are managed via HTTP-only cookies.
- Payment flows are robust and user-friendly.

---

## 🤝 Contributing

Contributions are welcome! Please open issues and pull requests for improvements, bug fixes, or new features.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💡 Credits

- [Razorpay](https://razorpay.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

<p align="center">
  <b>Made with ❤️ for shoppers
