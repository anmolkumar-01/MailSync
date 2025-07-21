# [MailSync](https://mailsync-one.vercel.app/)
### Send Emails to multiple recipients on one click

> A full-stack app to easily create and send AI-powered bulk emails with file uploads and cloud attachments


## 🚀 Objective

```
╭──────────────────────────────────────────────────────────╮
│  📧 MailSync automates bulk email sending process.       │
│                                                           │
│  ✔️ Upload files (.txt, .pdf, .docx, .xls, .xlsx, .csv)  │
│  ✔️ Extract email addresses automatically                │
│  ✔️ Generate email content with Google Gemini AI         │
│  ✔️ Attach files via Cloudinary                          │
│  ✔️ Send to multiple recipients with one click           │
╰──────────────────────────────────────────────────────────╯
```
## 🛠️ Technology Stack

### 🖥️ **Frontend**

```
╭────────────────────────────────────────────╮
│  ⚙️ React.js - Interactive UI              │
│  ⚙️ Zustand - State management             │
│  ⚙️ Tailwind CSS - Flexible styling        │
│  ⚙️ Shadcn - Pre-built UI components       │
│  ⚙️ Lucide React - Icon support            │
│  ⚙️ React Quill - Rich text editor         │
╰────────────────────────────────────────────╯
```

### 🗄️ **Backend**

```
╭──────────────────────────────────────────────────────────╮
│  ⚙️ Node.js & Express.js - API Development               │
│  ⚙️ MongoDB - Database Storage                           │
│  ⚙️ JWT - Authentication and Session Management          │
│  ⚙️ Multer - File Upload Handling                        │
│  ⚙️ File Parsers:                                        │
│    • pdf-parse - PDF Files                               │
│    • mammoth - DOCX Files                                │
│    • xlsx - Excel Files                                  │
│    • csv-parser - CSV Files                              │
╰──────────────────────────────────────────────────────────╯
```

### ☁️ **Cloud Services & APIs**

```
╭──────────────────────────────────────────────────────────╮
│  🤖 Google Gemini AI - Email Content Generation          │
│  ☁️ Cloudinary - File Hosting                            │
│  📬 Nodemailer - Email Dispatch                          │
│  🔐 Google Authentication - Secure Login                 │
╰──────────────────────────────────────────────────────────╯
```
## 🗂️ High-Level Architecture

### 🔑 **Authentication Flow**

```
╭──────────────────────────────────────────────────────────╮
│  🔐 Google OAuth Login                                   │
│  🔑 JWT token stored in HTTP-only cookie                 │
│  🗃️ User data managed in MongoDB                         │
╰──────────────────────────────────────────────────────────╯
```

### 📧 **Email Sending Flow**

```
╭──────────────────────────────────────────────────────────╮
│  📂 Upload recipient files                               │
│  🧰 Parse emails using multiple parsers                  │
│  🤖 Generate subject & body using Gemini AI              │
│  ☁️ Upload attachments to Cloudinary                     │
│  📬 Send bulk emails via Nodemailer                      │
╰──────────────────────────────────────────────────────────╯
```
## 📩 Summary

```
╭──────────────────────────────────────────────────────────╮
│  MailSync simplifies creating and sending bulk emails    │
│  by combining AI-driven content generation, easy file    │
│  management, and cloud-based attachments.                │
╰──────────────────────────────────────────────────────────╯
```
