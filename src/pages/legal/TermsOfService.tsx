import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function TermsOfService() {
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
            <h1 className="text-4xl font-display font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                <p>
                  These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ZIVARA ("we," "us," or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. User Representations</h2>
                <p>By using the Site, you represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>All registration information you submit will be true, accurate, current, and complete.</li>
                  <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                  <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                  <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. AI Try-On Feature Guidelines</h2>
                <p>When utilizing our AI Try-On functionality, you agree to the following strict usage rules:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Appropriate Content:</strong> You may only upload photos of yourself. You may not upload photos of other individuals without their explicit, documented consent.</li>
                  <li><strong>No Explicit Material:</strong> You are strictly prohibited from uploading nudity, sexually explicit content, violent imagery, or any material that violates local or international laws. Our systems actively monitor for and reject such content.</li>
                  <li><strong>Accuracy of Results:</strong> The AI Try-On feature provides a digital approximation of how garments may look. We do not guarantee that the physical product will perfectly match the AI-generated rendering in fit, drape, or color.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Products and Purchases</h2>
                <p>
                  We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
                </p>
                <p className="mt-4">
                  Currently, our platform operates primarily on a Cash on Delivery (COD) basis. By placing an order, you agree to have the necessary funds available upon physical delivery of your items.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Intellectual Property Rights</h2>
                <p>
                  Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
                <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
                <p className="mt-4 font-semibold">ZIVARA Support</p>
                <p>Email: legal@zivara.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
