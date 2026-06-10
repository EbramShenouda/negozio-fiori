import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '../../config';

/**
 * Componente SEO: imposta title, meta description e Open Graph.
 */
export default function SEOHead({ title, description, image, url }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Bouquet e Composizioni Floreali`;
  const metaDesc  = description || 'Fiori di Sandro: bouquet freschi, composizioni artigianali e piante ornamentali. Ordina su WhatsApp.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {url   && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type"        content="website" />
      {image && <meta property="og:image" content={image} />}
      {url   && <meta property="og:url"   content={url} />}

      {/* Twitter */}
      <meta name="twitter:card"  content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
