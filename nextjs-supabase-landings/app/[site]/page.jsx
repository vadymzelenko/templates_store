import { notFound } from "next/navigation";
import { getSite, listSiteIds } from "@/sites/registry";

export function generateStaticParams() {
  return listSiteIds().map((site) => ({ site }));
}

export default function SiteLandingPage({ params }) {
  const site = getSite(params.site);
  if (!site) notFound();

  const { Landing } = site;
  return <Landing />;
}
