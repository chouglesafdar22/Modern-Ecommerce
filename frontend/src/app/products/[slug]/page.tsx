import Not_found from "@/app/not-found";
import ProductDetails from "./ProductDetailsPage";

export const dynamic = "force-dynamic";

// No explicit PageProps
export default async function ProductDetailPage({ params }: any) {
  const { slug } = await params;
  console.log("Full slug:", slug);
  const id = slug?.split("-").pop();
   console.log("Extracted ID:", id);

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: "no-store",
    });

     console.log("API Response Status:", res.status);

    if (!res.ok) return <Not_found />;

    const product = await res.json();
    return <ProductDetails product={product} />;
  } catch (error) {
    return <Not_found />;
  }
}



