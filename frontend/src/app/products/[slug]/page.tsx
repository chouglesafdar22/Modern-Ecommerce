import Not_found from "@/app/not-found";
import ProductDetailsPage from "./ProductDetailsPage";

export const dynamic = "force-dynamic";

// No explicit PageProps
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  console.log("Full slug:", slug);
  const id = slug.split("-").pop();
  console.log("Extracted ID:", id);

  if (!id) return <Not_found />;

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);

    console.log("API Response Status:", res.status);

    if (!res.ok) return <Not_found />;

    const product = await res.json();
    return <ProductDetailsPage product={product} />;
  } catch (error) {
    console.error(error)
    return <Not_found />;
  }
}
