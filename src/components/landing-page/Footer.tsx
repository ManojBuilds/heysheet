
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-zinc-100">HeySheet</span>
            </div>
            <p className="text-zinc-400 mb-4 max-w-md">
              Build beautiful forms that sync with Google Sheets in real-time. 
              No code required, no complex integrations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-green-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-zinc-100 font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Features</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Integrations</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">API</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-zinc-100 font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Contact</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            © 2024 HeySheet. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-zinc-500 hover:text-zinc-400 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-400 text-sm transition-colors">Terms</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-400 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
