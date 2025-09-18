import { Suspense } from "react";
import CreateListingPageClient from "./CreateListingPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-white p-8">Loading...</div>}>
      <CreateListingPageClient />
    </Suspense>
  );
}
