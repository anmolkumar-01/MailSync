import { ShieldCheck, Mail } from 'lucide-react';


export function PrivacyPolicy() {
  const effectiveDate = "July 23, 2024";

  return (

    // 1. Full-screen container that centers its child
    <div className="bg-slate-50/50 h-screen w-screen p-4 sm:p-6 flex items-center justify-center antialiased">
      
      {/* 2. The main card.*/}
      <main className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl h-full max-h-[90vh] flex flex-col">

        {/* 3. The card's header. It takes up only the space it needs. */}
        <header className="p-6 border-b border-slate-200">
          <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold text-blue-900">
            <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
            Privacy Policy
          </h1>
          <p className="text-slate-500 mt-2">
            Effective Date: {effectiveDate}
          </p>
        </header>

        {/* 4. The scrollable content area. */}

        <div className="flex-1 overflow-y-auto p-6 prose prose-slate max-w-none">
          <p>
            At MailSync, we take your privacy seriously. This Privacy Policy outlines what information we collect, how we use it, and your rights regarding that information, especially in relation to the Google services we use to power our application.
          </p>

          {/* --- Section 1 --- */}
          <h3>1. Information We Collect & Permissions Requested</h3>
          <p>
            To provide our services, we request your permission to access specific information from your Google Account. We only request scopes that are essential for the app to function. Here is a detailed breakdown:
          </p>
          <ul>
            <li>
              <strong>Basic Profile Information:</strong> For a secure sign-in, we use standard permissions including <span className="font-mono text-sm bg-slate-100 text-slate-800 px-1.5 py-1 rounded">openid</span>, <span className="font-mono text-sm bg-slate-100 text-slate-800 px-1.5 py-1 rounded">.../auth/userinfo.email</span>, and <span className="font-mono text-sm bg-slate-100 text-slate-800 px-1.5 py-1 rounded">.../auth/userinfo.profile</span>. This allows us to see your email address, name, and profile picture to personalize your experience.
            </li>
            <li>
              <strong>Permission to Send Email:</strong> We request the sensitive <span className="font-mono text-sm bg-slate-100 text-slate-800 px-1.5 py-1 rounded">.../auth/gmail.send</span> scope. This permission is necessary to allow our application to send emails on your behalf when you compose and send them from our interface. You are in complete control of this process; the app will never send an email without your explicit action.
            </li>
          </ul>
          <p>
              We do not store the content of your emails on our servers.
          </p>


          {/* --- Section 2 --- */}
          <h3>2. How We Use Your Information</h3>
          <p>
            We use the data accessed via these permissions solely to:
          </p>
          <ul>
            <li>Authenticate and create your user account using your Google identity.</li>
            <li>Display your name and profile picture within the application.</li>
            <li>
              Enable the core functionality of our service, which is to send emails on your behalf when you initiate the action through MailSync.
            </li>
          </ul>
          <p>
            <strong>We do not sell, rent, or share your personal data with third parties for marketing purposes.</strong>
          </p>

          {/* --- Section 3 --- */}
          <h3>3. Data Security</h3>
          <p>
            We are committed to protecting your data. We use industry-standard encryption and secure methods to protect your information. All communication between your device and Google's servers through our application is secured using HTTPS.
          </p>

          {/* --- Section 4 --- */}
          <h3>4. Data Retention</h3>
          <p>
            We retain your basic Google Account Information (name, email, profile picture) for as long as your account is active with us. You can delete your account at any time, which will remove this information from our systems.
          </p>

          {/* --- Section 5 --- */}
          <h3>5. Your Rights & Choices</h3>
          <p>
            You have the right to access, update, or delete your personal information. You can review and revoke the permissions granted to MailSync at any time through your Google Account security settings page. Revoking permissions may limit or disable the functionality of the application.
          </p>

          {/* --- Section 6 --- */}
          <h3>6. Third-Party Services</h3>
          <p>
            Our service is fundamentally dependent on Google APIs. Your use of our service is also subject to the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
          </p>

          {/* --- Section 7 --- */}
          <h3>7. Changes to This Policy</h3>
          <p>
            We may update this policy from time to time. If we make significant changes, we will notify you via the email address associated with your account or by placing a prominent notice within the application.
          </p>

          {/* --- Section 8 --- */}
          <h3>8. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="flex items-center gap-2 not-prose">
            <Mail className="h-4 w-4 text-slate-500"/>
            <a href="mailto:mailsyncai@gmail.com" className="text-blue-600 font-medium no-underline hover:underline">
                mailsyncai@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}


