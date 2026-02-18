# Amazon Fast Login Assistant

An advanced Chrome Extension designed to automate the login process for the **Amazon Hiring Authentication** page. This tool boosts productivity by securely storing multiple account credentials and enabling one-click login from any page.

![Banner](src/assets/icons/logo.png) *(Note: Replace with actual screenshot or logo)*

## 🚀 Key Features

*   **⚡ One-Click Automation**: Automatically navigates to the login page and fills in your ID and PIN.
*   **🔐 Secure Storage**: Credentials are saved locally within your browser using Chrome's secure storage API.
*   **📂 Multi-Account Support**: Manage multiple accounts easily with a clean, list-based interface.
*   **🎨 Modern UI**: Features a beautiful, responsive, and user-friendly interface built with React and Tailwind CSS.
*   **✏️ Edit & Update**: Easily update your credentials or remove old accounts.
*   **🛡️ Safety First**: Confirmation modals prevent accidental deletions.

## 🛠️ How it Works

1.  **Add Account**: Open the extension and click the **+** icon to add your Login ID and PIN.
2.  **Start Login**: Click "Start Login" on any saved account.
    *   If you are on the Amazon login page, it will instantly fill your details.
    *   If you are on another page, it will automatically navigate you to `https://auth.hiring.amazon.com/#/login` and then proceed with the login.
3.  **Manage**: Edit details by clicking the **Pencil** icon or remove an account with the **Trash** icon.

## 📦 Installation (Developer Mode)

1.  **Clone or Download** this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the `dist` folder from this project directory.
6.  The extension is now installed!

## 🔧 Development Setup

This project is built with:
*   [React](https://reactjs.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Webpack](https://webpack.js.org/)

### Prerequisites
*   Node.js and npm/yarn installed.

### Steps
1.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
2.  Start development build (watch mode):
    ```bash
    npm run dev
    # or
    yarn dev
    ```
3.  Build for production:
    ```bash
    npm run build
    # or
    yarn build
    ```

## 📝 License
This project is licensed for internal use.

---
**Disclaimer**: This tool is for educational and productivity purposes only. Use responsibly and ensure you comply with Amazon's terms of service.