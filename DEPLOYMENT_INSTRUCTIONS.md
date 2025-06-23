# Production Deployment Steps

Here are the commands to deploy the project to a production environment. These should be run from the root of the project directory.

---

### **Step 1: Get the Latest Code**

First, ensure you have the most recent version of the code from the main branch.

```bash
git pull origin main
```

---

### **Step 2: Install Dependencies**

Install or update all the necessary project dependencies. This ensures you have the correct versions of all packages.

```bash
npm install
```

---

### **Step 3: Set Up Production Environment File**

This command copies the production environment variables from `env.production` into a `.env.local` file. The `.env.local` file is what Next.js will use for the build.

```bash
npm run env:production
```

> **Important:** Before running this, double-check that the `env.production` file has the correct values for the production database, API keys, domains, and other necessary variables.

---

### **Step 4: Build the Application for Production**

This command creates a highly optimized and production-ready build of the application. The output will be stored in the `.next` folder.

```bash
npm run build:production
```

---

### **Step 5: Start the Production Server**

This command starts the optimized Next.js server, which serves the application you just built. For a real production deployment, it is highly recommended to use a process manager like PM2 to ensure the application runs continuously and restarts automatically if it crashes.

#### **Option A: Running the server directly**

(Useful for quick tests, but not recommended for a live server)

```bash
npm run start:production
```

#### **Option B: Running with PM2 (Recommended for Production)**

If you don't have PM2 installed on the server, you can install it globally with:

```bash
npm install pm2 -g
```

Then, start the application using PM2. This will run it in the background as a managed process.

```bash
pm2 start "npm run start:production" --name "talent-hub-fe"
```

You can then manage the application with these commands:

- **Check the status of all running applications:**
  ```bash
  pm2 list
  ```
- **View the live logs for your app:**
  ```bash
  pm2 logs talent-hub-fe
  ```
- **Stop the application:**
  ```bash
  pm2 stop talent-hub-fe
  ```
- **Restart the application:**
  ```bash
  pm2 restart talent-hub-fe
  ```

---
