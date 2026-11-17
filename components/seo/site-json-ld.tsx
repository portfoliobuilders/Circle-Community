import { JsonLd } from "@/components/seo/json-ld";
import { site, social } from "@/lib/site";

const sameAs = [social.instagram.href, social.whatsappChannel.href, social.whatsappCommunity.href];

export function SiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${site.url}/#organization`,
            name: site.name,
            url: site.url,
            email: "info@circlecommunity.in",
            description: site.description,
            logo: `${site.url}/brand/logo-white.png`,
            sameAs,
            parentOrganization: {
              "@type": "Organization",
              name: site.operator,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kochi",
                addressRegion: "Kerala",
                addressCountry: "IN",
              },
            },
          },
          {
            "@type": "WebSite",
            "@id": `${site.url}/#website`,
            name: site.name,
            url: site.url,
            description: site.description,
            inLanguage: "en-IN",
            publisher: { "@id": `${site.url}/#organization` },
          },
        ],
      }}
    />
  );
}
