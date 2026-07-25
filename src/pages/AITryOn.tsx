import { useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Camera, X, Download, Share2, ArrowRight, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products } from "@/data/products";
import { useAITryOn } from "@/hooks/useAITryOn";
import { Progress } from "@/components/ui/progress";

export default function AITryOn() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedClothingId, setSelectedClothingId] = useState<string | null>(productId);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { generateTryOn, isProcessing, progress, error } = useAITryOn();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userImage || !selectedClothingId) return;

    const selectedClothing = products.find((p) => p.id === selectedClothingId);
    if (!selectedClothing) return;

    const result = await generateTryOn(
      userImage,
      selectedClothing.image,
      selectedClothing.name
    );

    if (result?.generatedImage) {
      setGeneratedImage(result.generatedImage);
    }
  };



  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `zivara-tryon-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    
    if (navigator.share) {
      try {
        // Convert base64 to blob for sharing
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], "zivara-tryon.png", { type: "image/png" });
        
        await navigator.share({
          title: "My ZIVARA AI FIT Preview",
          text: "Check out how this outfit looks on me!",
          files: [file],
        });
      } catch (err) {
        // Fallback: copy image URL
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const selectedClothing = products.find((p) => p.id === selectedClothingId);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[100px]" />
        </div>
        
        <div className="container-premium relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                ZIVARA AI FIT
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Virtual Try-On Experience
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your photo and see how our pieces look on you. 
              Our AI technology creates a realistic preview in seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Try-On Interface */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1: Upload Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </span>
                <h3 className="font-semibold text-foreground">Upload Your Photo</h3>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {userImage ? (
                <div className="relative">
                  <img
                    src={userImage}
                    alt="Your photo"
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setUserImage(null);
                      setGeneratedImage(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[3/4] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">Upload a photo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Full body shot works best
                    </p>
                  </div>
                </button>
              )}
              
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-3">
                Max file size: 5MB • JPG, PNG supported
              </p>
            </motion.div>

            {/* Step 2: Select Clothing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </span>
                <h3 className="font-semibold text-foreground">Select Clothing</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedClothingId(product.id)}
                    className={`relative rounded-lg overflow-hidden transition-all ${
                      selectedClothingId === product.id
                        ? "ring-2 ring-primary scale-[1.02]"
                        : "hover:ring-1 hover:ring-border"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    {selectedClothingId === product.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {selectedClothing && (
                <div className="mt-4 p-3 bg-secondary rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    {selectedClothing.name}
                  </p>
                  <p className="text-sm text-primary">${selectedClothing.price}</p>
                </div>
              )}
            </motion.div>

            {/* Step 3: Result */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </span>
                <h3 className="font-semibold text-foreground">AI Preview</h3>
              </div>
              
              <div className="aspect-[3/4] bg-secondary/50 rounded-lg overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-6"
                    >
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-primary/30 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        AI is creating your virtual try-on...
                      </p>
                      <div className="w-full max-w-[200px]">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          {Math.round(progress)}%
                        </p>
                      </div>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                    >
                      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                      <p className="text-sm text-destructive mb-2">Generation Failed</p>
                      <p className="text-xs text-muted-foreground">{error}</p>
                    </motion.div>
                  ) : generatedImage ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full"
                    >
                      <img
                        src={generatedImage}
                        alt="AI Generated Preview"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                    >
                      <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Upload a photo and select clothing to see the AI preview
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-3">
                <button
                  onClick={handleTryOn}
                  disabled={!userImage || !selectedClothingId || isProcessing}
                  className="w-full btn-ai flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  {isProcessing ? "Generating..." : "Generate Preview"}
                </button>
                
                {generatedImage && (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                )}
                
                {selectedClothing && (
                  <Link
                    to={`/product/${selectedClothing.id}`}
                    className="flex items-center justify-center gap-2 py-3 text-primary hover:underline"
                  >
                    View Product Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-card">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground mb-8">
              Our AI-powered virtual try-on uses advanced machine learning to create 
              realistic previews of how our clothing will look on you.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-background rounded-lg">
                <Camera className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Upload Photo</h4>
                <p className="text-sm text-muted-foreground">
                  Take a full-body photo or upload from your gallery
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">AI Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your body and maps the clothing perfectly
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Save & Share</h4>
                <p className="text-sm text-muted-foreground">
                  Download your preview or share it with friends
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
