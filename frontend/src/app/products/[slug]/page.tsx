import Not_found from "@/app/not-found";
import ProductDetails from "./ProductDetailsPage";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const id = slug.split("-").pop();
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();
    return <ProductDetails product={product} />;
  } catch (error) {
    return <Not_found />;
  }
}
