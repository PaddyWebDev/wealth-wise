export default function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "Security", "FAQ"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy", "Terms", "Cookie Policy", "Disclaimer"],
  }

  return (
    <footer className=" dark:bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Logo */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center dark:bg-neutral-800 bg-neutral-50 justify-center">
                <span className="font-bold text-lg text-neutral-50 ">₹</span>
              </div>
              <span className="font-bold text-lg">WealthWise</span>
            </div>
            <p className="text-sm dark:text-white/70">Your intelligent personal finance companion.</p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="font-semibold mb-4">{category}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm dark:text-white/70 dark:hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm dark:text-white/70">© 2025 WealthMind. All rights reserved.</p>
            <div className="flex gap-6">
              {["Twitter", "LinkedIn", "Facebook", "Instagram"].map((social) => (
                <a key={social} href="#" className="dark:text-white/70 dark:hover:text-white transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
