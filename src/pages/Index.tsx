import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductGrid from "@/components/home/ProductGrid";
import AITryOnPromo from "@/components/home/AITryOnPromo";
import AITryOnScrollCanvas from "@/components/home/AITryOnScrollCanvas";
import CustomerReviews from "@/components/home/CustomerReviews";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      {/* 3D Interactive AI Try-On Hero Scroll Banner */}
      <AITryOnScrollCanvas />
      <FeaturedCategories />
      <ProductGrid
        title="Trending Now"
        subtitle="Editor's Pick"
        filter="best"
        limit={6}
      />
      <AITryOnPromo />
      <ProductGrid
        title="New Arrivals"
        subtitle="Just Landed"
        filter="new"
        limit={6}
      />
      <CustomerReviews />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Index;
