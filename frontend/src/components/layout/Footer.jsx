import React from 'react';

const Footer = () => (
    <footer className="bg-white border-t border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} MailSync. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;