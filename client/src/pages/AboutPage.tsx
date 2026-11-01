import { useState } from "react";
import "./AboutPage.css";
import { aboutContent } from "../data/aboutPgBPK";

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

                        <ul>
                            {aboutContent.socialLinks.links.map((social) => (
                                <li key={social.name}>
                                    <a href={social.href}>{social.name}</a>
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