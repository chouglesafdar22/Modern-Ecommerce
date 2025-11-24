import Not_found from "@/app/not-found";
import ProductDetailsPage from "./ProductDetailsPage";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const id = slug.split("-").pop();

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  return <ProductDetailsPage product={product} />;
}
