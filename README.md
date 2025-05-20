# 🧑‍💻 CodeCampus

**CodeCampus** is a full-stack, web-based competitive coding platform that empowers universities to host, manage, and evaluate coding, quiz, and project-based competitions. With institute-wise leaderboards, real-time scoring, and secure code execution, CodeCampus brings structure, fairness, and engagement to academic challenges.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization**
  - OAuth 2.0 integration
  - Role-based access (Admin/User)

- 🧪 **Competition Management**
  - Host coding, quiz, and project contests
  - Automated scoring for objective rounds
  - Real-time leaderboard with institute-wise ranking

- 💻 **Secure Code Execution**
  - Supports C, C++, Java
  - Docker-based isolated execution
  - LRU caching for faster re-execution
  - Test case validation with logging

- ⚙️ **Custom Execution Server**
  - Receives code as a string from MongoDB
  - Avoids redundant file creation
  - Handles multiple submissions efficiently via queue

- 📊 **Leaderboard & Analytics**
  - Institute-wise ranking
  - Real-time updates
  - Code submission logs

---

## 🛠️ Tech Stack

### 🔧 Backend
- **Java**, **Spring Boot**
- **MongoDB** for competition data
- **Piston Api** for code execution requests
- **Docker** for deployment
- **Spring Security** for session-based authentication
- **OAuth2** for google and github login
- **Custom Execution Engine** with LRU cache & queue system based on docker (not implemented in this project)

### 🎨 Frontend
- **React.js** (with Vite)
- **Tailwind CSS**
- **SweetAlert2** for alerts & notifications
- **Shadcn** for modern ui components
- **WebSockets/EventBus** for real-time updates

---

## 🧪 Development Timeline

- 🗓️ **Planning Start**: Mar 2025  
- 🔨 **Development Start**: Mar 2025  
- ⚙️ **Frontend & Backend**: Developed in parallel  
- 🔗 **Integration**: Executed alongside development  

---

## 👨‍💻 Admin Features

- Manage users, contests, and system-wide configurations  
- Full API access to all entities  
- Role-based permission handled via `User` collection  

---

## 📂 Project Structure
codecampus/
├── backend/
│ └── src/main/java/com/codecampus/...
├── frontend/
│ └── src/
│ └── components/
│ └── pages/
│ └── services/
└── README.md

---

## 🎥 Demo Video

📺 [Watch on YouTube](https://youtu.be/your-codecampus-demo)

---

## 🔐 Security & Execution

- OAuth 2.0 for secure login  
- Session-based auth with Spring Security  
- Docker sandbox for secure and isolated code execution (not implemented in this project)
- Read-only public leaderboard  

---

## 📌 Future Enhancements

- 📄 Support for Python, JavaScript execution  
- 📅 Contest scheduling and auto evaluation  
- 🧠 AI feedback on code submissions  
- 📈 Admin dashboard analytics  
- 🧪 Code plagiarism checker  

---

## 🤝 Contributing

Contributions are welcome! Fork the repository and open a pull request with a detailed description of your changes.

---

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 📫 Contact

For questions, ideas, or feedback:  
📧 Email: [deepghosh146@gmail.com]  
🌐 Website: [your-portfolio-link.com]
