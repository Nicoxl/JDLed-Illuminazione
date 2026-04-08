# 💡 JdLed Project Lux - Web App

Welcome to the official repository of **JdLed Illuminazione**, a digital platform dedicated to premium LED lighting solutions for interiors and exteriors.

🔗 **Live Website:** [https://jdledprojectlux.com/](https://jdledprojectlux.com/)

## 📖 Project Description

**JdLed Illuminazione (Project Lux)** (formerly Benetti Illuminazione) combines technical expertise with the latest lighting design trends. This web application serves as a high-end digital showcase, allowing customers to explore lighting collections and request professional consultations.

### 💡 Services and Products

* **Interior Lighting:** Aesthetic and functional solutions to enhance comfort in domestic and professional spaces.
* **Outdoor Lighting:** Durable, designer systems to illuminate gardens, facades, and open areas.
* **Technical Consulting:** Expert support in lighting design and product selection.

## ✨ Website Features

* **Visual Product Gallery:** Intuitive navigation through various high-quality LED categories.
* **Brand Legacy:** A dedicated section about the business evolution from Benetti Illuminazione to JdLed Illuminazione.
* **Quick Access:** Direct links for Email, Phone, and physical office location in Cornedo Vicentino (VI), Italy.
* **Responsive Design:** Fully optimized for a seamless experience on smartphones, tablets, and desktops.

## 🛠️ Technology Stack

* **Frontend:** Modern HTML5, CSS3 (Custom Flexbox/Grid), and JavaScript.
* **Hosting:** [Firebase Hosting](https://firebase.google.com/) for fast and secure global delivery.
* **CI/CD:** GitHub Actions for automated deployment.
* **Code Quality:** Custom configurations via `.hintrc` (Webhint) to ensure accessibility and performance best practices.

## 🚀 Deployment Workflow

This repository is configured with a **Continuous Deployment** pipeline. Every push to the `main` branch is automatically published to the live site:

1. Modify files locally.
2. Push to GitHub:

   ```bash
   git add .
   git commit -m "Update lighting collection"
   git push origin main
    ```

3. **GitHub Actions** will detect the change and automatically update the live site.

## 📁 Project Structure

```text
├── .github/workflows/ # Automatic Deployment Configurations
├── public/ # Site source files (HTML, CSS, JS)
├── firebase.json # Firebase Hosting Configuration
├── package.json # Dependency Management and Build Scripts
└── README.md # Project Documentation
```

## 🔒 Compliance and Legal Notices

The project ensures transparency and user protection:

* **[Privacy & Cookie Policy](./public/privacy-policy.html):** GDPR-compliant data management.
* **[Legal Notices / Terms](./public/terms-notes.html):** Corporate information and terms of service.

## 📞 Contact Information

* **Owner:** Jessica Dal Lago
* **Technical Developer:** [Nicola Benetti](https://github.com/Nicoxl)

---
*Copyright © 2026 JdLed Illuminazione (Project Lux) - All rights reserved.*
