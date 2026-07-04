import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function CookiePolicy() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container-premium max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-display font-bold mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. What are Cookies?</h2>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
                <p>We use cookies for several reasons, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Essential Cookies:</strong> These are strictly necessary to provide you with services available through our website and to use some of its features, such as securely logging in and managing your shopping cart.</li>
                  <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. For example, remembering your previously selected preferences.</li>
                  <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. AI Try-On Feature & Session Management</h2>
                <p>
                  When you use our AI Try-On feature, we may use short-lived session tokens (which act similarly to cookies) to temporarily associate your uploaded photo with your current browsing session. This ensures that the generated AI preview is securely returned only to your device. These session tokens are destroyed when you close your browser or navigate away from the site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Managing Cookies</h2>
                <p>
                  You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website (like your personalized shopping cart or logged-in state) may be restricted.
                </p>
                <p className="mt-4">
                  To learn more about how to manage cookies, you can visit the help section of your web browser.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Changes to this Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
