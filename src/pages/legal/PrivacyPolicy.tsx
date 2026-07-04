import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl font-display font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p>
                  At ZIVARA, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our AI Try-On service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Collection of your Information</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.</li>
                  <li><strong>AI Try-On Image Data:</strong> When you use our AI Try-On feature, you may voluntarily upload photos of yourself. These images are processed strictly to generate virtual try-on previews.</li>
                  <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. AI Try-On & Biometric Data Handling</h2>
                <p>Because our AI Try-On feature requires you to upload personal photos, we enforce strict data handling policies:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Purpose of Processing:</strong> Photos are used solely to generate a realistic virtual representation of you wearing our clothing items.</li>
                  <li><strong>Data Retention:</strong> We do not permanently store your uploaded photos. Photos are processed temporarily in our memory and are automatically deleted from our servers shortly after the AI Try-On session ends.</li>
                  <li><strong>No AI Training:</strong> Your personal photos are <strong>never</strong> used to train, retrain, or improve our core machine learning models or those of our third-party AI providers.</li>
                  <li><strong>Third-Party Processing:</strong> We may use secure third-party API providers to generate the try-on images. These providers are bound by strict confidentiality agreements and do not retain your photos.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Use of Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Create and manage your account.</li>
                  <li>Process your orders, payments, and deliveries.</li>
                  <li>Deliver the AI Try-On generated images directly back to your screen.</li>
                  <li>Send you marketing and promotional communications (with your consent).</li>
                  <li>Improve our website performance and customer service.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <p className="mt-4 font-semibold">ZIVARA Legal Team</p>
                <p>Email: privacy@zivara.com</p>
                <p>Address: New York, NY 10001, United States</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
