import Not_found from "@/app/not-found";
import ProductDetails from "./ProductDetailsPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = params;
  const id = slug.split("-").pop();

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return notFound();

    const product = await res.json();
    return <ProductDetails product={product} />;
  } catch (error) {
    return <Not_found />;
  }
}
