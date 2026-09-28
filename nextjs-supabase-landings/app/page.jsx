import Link from "next/link";
import { listSiteIds, getSite } from "@/sites/registry";

export default function Home() {
  const ids = listSiteIds();
  return (
    <main style={{ padding: 40, fontFamily: "system-ui, sans-serif", background: "#0c0a09", color: "#f5f0ea", minHeight: "100vh" }}>
      <h1>Зарегистрированные сайты</h1>
      <ul>
        {ids.map((id) => {
          const site = getSite(id);
          return (
            <li key={id} style={{ margin: "12px 0" }}>
              <Link href={`/${id}`} style={{ color: "#c9a05a" }}>
                {site.config.meta?.title || id}
              </Link>
              {"  "}
              <Link href={`/${id}/admin`} style={{ color: "#a8a099", fontSize: 13 }}>
                (админка)
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
