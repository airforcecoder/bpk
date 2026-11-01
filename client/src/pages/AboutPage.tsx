import { useState, type ReactNode } from "react";
import "./AboutPage.css";
import { aboutContent } from "../data/aboutPgBPK";

/* Icon shapes for each platform, keyed by the "name" in aboutPgBPK.ts */
const SOCIAL_ICONS: Record<string, ReactNode> = {
    Facebook: (
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
    Instagram: (
        <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </>
    ),
    TikTok: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
};

function SocialLink({ name, href }: { name: string; href: string }) {
    const icon = SOCIAL_ICONS[name];

    /* Unknown platform: fall back to the old text link */
    if (!icon) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {name}
            </a>
        );
    }

    return (
        <a
            className="social-icon"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${name} (opens in a new tab)`}
            title={name}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
            >
                {icon}
            </svg>
        </a>
    );
}

function GalleryImage({
    src,
    alt
}: {
    src?: string;
    alt: string;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageSrc = src?.trim();

    if (!imageSrc || imageFailed) {
        return (
            <div className="about-gallery__placeholder" aria-label="No image">
                No image
            </div>
        );
    }

    return (
        <img
            className="about-gallery__image"
            src={`${import.meta.env.BASE_URL}${imageSrc.replace(/^\/+/, "")}`}
            alt={alt}
            loading="lazy"
            onError={() => setImageFailed(true)}
        />
    );
}


function AboutPage() {
    return (
        <main className="page-container about-page">
            <section className="about-section">
                <div className="about-content">
                    <h1 className="about-title">{aboutContent.title}</h1>

                    <div className="about-description">
                        {aboutContent.paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    <div className="about-gallery">
                        {aboutContent.gallery.map((image) => (
                            <GalleryImage
                                key={image.src}
                                src={image.src}
                                alt={image.alt}
                            />
                        ))}
                    </div>

                    <div className="business-info">
                        <h2>{aboutContent.businessInfo.heading}</h2>

                        <p>
                            <strong>{aboutContent.businessInfo.labels.location}:</strong>{" "}
                            {aboutContent.businessInfo.values.location}
                        </p>

                        <p>
                            <strong>{aboutContent.businessInfo.labels.email}:</strong>{" "}
                            {aboutContent.businessInfo.values.email}
                        </p>

                        <p>
                            <strong>{aboutContent.businessInfo.labels.phone}:</strong>{" "}
                            {aboutContent.businessInfo.values.phone}
                        </p>
                    </div>

                    <div className="social-links">
                        <h2>{aboutContent.socialLinks.heading}</h2>

                        <ul className="social-links__list">
                            {aboutContent.socialLinks.links.map((social) => (
                                <li key={social.name}>
                                    <SocialLink name={social.name} href={social.href} />
                                </li>
                            ))}
                        </ul>
                        
                    </div>
                </div>

            </section>
        </main>
    );
}

export default AboutPage;