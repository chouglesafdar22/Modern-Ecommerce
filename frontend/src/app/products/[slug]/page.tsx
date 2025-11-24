import Not_found from "@/app/not-found";
import ProductDetailsPage from "./ProductDetailsPage";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const id = slug.split("-").pop();

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return <Not_found />;

    const product = await res.json();
    return <ProductDetailsPage product={product} />;
  } catch (error) {
    return <Not_found />;
  }
}

