import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Camera, Wand2 } from "lucide-react";
import aiTryonPromo from "@/assets/ai-tryon-promo.jpg";

export default function AITryOnPromo() {
  return (
    <section className="section-padding bg-card relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="container-premium relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                AI-Powered Fashion
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Try Before You Buy with{" "}
              <span className="text-gradient">ZIVARA AI FIT</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Experience the future of fashion shopping. Upload your photo, select any item, 
              and see yourself wearing it instantly with our revolutionary AI technology.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary text-primary flex-shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Upload Your Photo</h4>
                  <p className="text-muted-foreground text-sm">
                    Take a full-body photo or upload from your gallery
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary text-primary flex-shrink-0">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">AI Magic</h4>
                  <p className="text-muted-foreground text-sm">
                    Our AI creates a realistic preview in seconds
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary text-primary flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Shop with Confidence</h4>
                  <p className="text-muted-foreground text-sm">
                    See how it looks on you before purchasing
                  </p>
                </div>
              </div>
            </div>

            <Link to="/ai-tryon" className="btn-ai inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Try AI Fitting Now
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={aiTryonPromo}
                alt="AI Try-On Experience"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 p-4 bg-card rounded-lg shadow-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Accuracy</p>
                  <p className="text-2xl font-bold text-primary">98.5%</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -top-4 -right-4 md:top-8 md:-right-8 p-4 bg-card rounded-lg shadow-lg border border-border"
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Happy Customers</p>
                <p className="text-2xl font-bold text-primary">50K+</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
