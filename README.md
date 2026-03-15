# 🛡️ Nixture - Application Security Scanner

**Nixture** is a modern, automated Application Security (AppSec) auditing tool built to enforce HTTP compliance and discover client-side web vulnerabilities. It instantly analyzes target web servers for missing or misconfigured security headers, providing developers with actionable insights to mitigate risks like Cross-Site Scripting (XSS), Clickjacking, and Man-in-the-Middle (MitM) attacks.

> "Security is not a product, but a process."

---

## ✨ Key Features

- **Real-Time Vulnerability Scanning:** Leverages Java's modern `HttpClient` to audit live web servers, automatically following redirects to map the true security posture of the final endpoint.
- **Proprietary Security Scoring:** A custom backend algorithm weights individual headers (HSTS, CSP, X-Frame-Options, etc.) to generate a comprehensive `0-100` security grade.
- **WAF Detection Logic:** Intelligently detects and handles Web Application Firewall (WAF) blocks (HTTP `403` and `429`), gracefully alerting the user rather than crashing the scanner.
- **Actionable Remediation:** Generates plain-English recommendations based on missing headers, guiding developers on exactly how to patch the vulnerabilities.
- **Premium UI/UX:** - Fully responsive, glassmorphism-inspired design.
  - Native **Dark/Light Mode** toggle with local storage persistence.
  - Interactive charts and animated scoring rings.
  - Beautiful, dynamic alerts powered by SweetAlert2.

---

##  Tech Stack

### Backend (The Engine)
- **Java 17+** – Core programming language.
- **Spring Boot 3.x** – REST API architecture and embedded server.
- **Java HttpClient** – High-performance, synchronous network request handling.
- **Jackson** – Seamless JSON serialization/deserialization.

### Frontend (The Presentation)
- **HTML5 & Vanilla JavaScript** – Asynchronous API communication (`fetch`, `async/await`).
- **Tailwind CSS** – Utility-first CSS framework for rapid, responsive UI development.
- **SweetAlert2** – Custom alert overlays and WAF block notifications.
- **FontAwesome** – Professional iconography.

---

##  Core Security Concepts Applied
This tool is a practical implementation of **Information Security and Legal Compliance (ISLC)** standards. It audits against the following OWASP-recommended headers:

1. **Strict-Transport-Security (HSTS):** Enforces HTTPS, preventing SSL Stripping.
2. **Content-Security-Policy (CSP):** The primary defense against Data Injection and XSS.
3. **X-Frame-Options:** Mitigates Clickjacking by controlling iframe rendering.
4. **X-Content-Type-Options:** Prevents MIME-sniffing execution flaws.
5. **Referrer-Policy:** Protects user privacy during external navigation.
6. **Permissions-Policy:** Restricts third-party access to hardware (Camera, Mic).

---

##  Getting Started (Local Development)

### Prerequisites
- **Java Development Kit (JDK) 17** or higher.
- **Maven** installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/AnimeshSoni777/nixture-appsec-scanner.git](https://github.com/AnimeshSoni777/nixture-appsec-scanner.git)
2. Navigate to the project directory:
   ```bash
   cd nixture-appsec-scanner
3. Build the project using Maven:
   ```bash
   mvn clean install
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
6. Open your browser and navigate to:  
  ```plaintext
  http://localhost:8081
