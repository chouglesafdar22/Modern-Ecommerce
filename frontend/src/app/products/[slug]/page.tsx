import Not_found from "@/app/not-found";
import ProductDetailsPage from "./ProductDetailsPage";

export const dynamic = "force-dynamic";

// Custom type — do NOT use Next.js PageProps
interface PageParams {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageParams) {
  const { slug } = params;

  console.log("Full slug:", slug);

  if (!slug) return <Not_found />;

  const id = slug.split("-").pop();

  if (!id || isNaN(Number(id))) return <Not_found />;

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: "no-store",
    });

    console.log("API Status:", res.status);

    if (!res.ok) return <Not_found />;

    const product = await res.json();
    return <ProductDetailsPage product={product} />;
  } catch (error) {
    console.error("Error:", error);
    return <Not_found />;
  }
}

