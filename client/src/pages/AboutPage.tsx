function AboutPage() {
    return (
        <main className="page-container about-page">
            <section className="about-section">
                <h1 className="about-title">About Banana Pudding Krazy</h1>

                <p className="about-description">
                    Welcome to Banana Pudding Krazy, where every bite is a celebration of comfort, 
                    joy and nostalgia. Our journey began with a simple moment: a friend's pregnancy
                    craving for banana pudding. That request sparked a passion that quickly turned into a business, 
                    sharing our uniquely delicious puddings with pudding lovers everywhere. 
                    At Banana Pudding Krazy, we’re on a mission to make connections through our unforgettable 
                    flavors and bring joy to all. We take a classic favorite and add our own unique twist, creating bold, 
                    exciting flavor combinations that keep our customers coming back for more. From our signature 3 x Krazy to the 
                    timeless OG Nilla and seasonal favorites like 'Pumpkin Pie Cheesecake and Egg Noggie Nog, we pour love, creativity 
                    and as many local ingredients as we can into every flavor. Thanks a BUNCH for supporting our small business and
                    joining us on this sweet journey. Whether you're reminiscing about family gatherings or looking for a new flavor experience,
                    Banana Pudding Krazy has something special for you!
                </p>

                <div className="business-info">
                    <h2>Business Information</h2>
                    <p><strong>Location:</strong> South Sacramento, CA</p>
                    <p><strong>Email:</strong> Bananapuddingkrazy@gmail.com</p>
                    <p><strong>Phone:</strong> (916) 893‑4132</p>
                </div>

                <div className="social-links">
                    <h2>Follow Us</h2>
                    <ul>
                        <li>
                            <a
                                href="https://www.facebook.com/Bananapuddingkrazy/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ marginBottom: "var(--space-sm)" }}
                            >
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/bananapudding_krazy/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ marginBottom: "var(--space-sm)" }}
                            >
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.tiktok.com/@banana.pudding.krazy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ marginBottom: "var(--space-sm)" }}
                            >
                                TikTok
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}

export default AboutPage;
