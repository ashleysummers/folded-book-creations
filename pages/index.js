import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { apiEndpoint, client } from '../prismic-configuration'
import {RichText} from 'prismic-reactjs'

// Smaller, compressed rendition for the grid (full-res stays in the lightbox)
function thumb(url) {
  if (!url) return url;
  return url + (url.includes('?') ? '&' : '?') + 'w=800&auto=compress,format';
}

// Category may be a Prismic select/key-text (string) or rich text (array)
function sliceCategory(slice) {
  const c = slice.primary.category;
  if (!c) return null;
  if (typeof c === 'string') return c;
  if (Array.isArray(c) && c.length && c[0].text) return c[0].text;
  return null;
}

export default function Home(props) {
  const document = props.home_page;
  const [lightbox, setLightbox] = useState(null);

  // Staggered reveal of gallery cards on scroll
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    window.document.body.classList.add('ws-reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('ws-revealed');
          el.addEventListener('transitionend', () => { el.style.transitionDelay = '0ms'; }, { once: true });
          observer.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
    window.document.querySelectorAll('.ws-works-item').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Group works by category, preserving Prismic order
  const groups = [];
  document.data.body.forEach(slice => {
    if (slice.slice_type !== 'folded_book') return;
    const name = sliceCategory(slice);
    let group = groups.find(g => g.name === name);
    if (!group) { group = { name, items: [] }; groups.push(group); }
    group.items.push(slice);
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Folded Book Creations — Handcrafted Book Art</title>
        <meta name="description" content="One-of-a-kind sculptures hand-folded from repurposed books." />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Merriweather:ital,wght@0,300;0,400;1,300&display=swap" />

        <script src="assets/js/plugins/jquery-1.11.3.min.js"></script>

        <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="assets/css/main.css" />
        <link rel="stylesheet" href="assets/css/animate.min.css" />

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />

        <script src="assets/js/plugins/bootstrap.min.js"></script>
        <script src="assets/js/plugins/modernizr-2.8.3-respond-1.4.2.min.js"></script>
        <script src="assets/js/plugins/parallax.min.js"></script>
        <script src="assets/js/plugins/scrollReveal.min.js"></script>
        <script src="assets/js/main.js"></script>
      </Head>

      {/* Video Hero */}
      <section className="ws-video-hero">
        <div className="ws-video-hero-frame">
          <iframe
            src="https://www.youtube.com/embed/s6KJ1NJvQ2A?autoplay=1&mute=1&loop=1&playlist=s6KJ1NJvQ2A&controls=0&rel=0&modestbranding=1&playsinline=1"
            title="Folded Book Creations"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            tabIndex="-1"
          />
        </div>
        <div className="ws-video-hero-overlay"></div>
        <div className="ws-video-hero-content">
          <span className="ws-hero-kicker">Handcrafted Book Art</span>
          <h1>Folded Book Creations</h1>
          <div className="ws-separator ws-separator-light"></div>
          <p>One-of-a-kind sculptures, folded page by page</p>
        </div>
        <a
          className="ws-hero-scroll"
          href="#about"
          aria-label="Scroll to content"
          onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <span></span>
        </a>
      </section>

      {/* About Section */}
      <section className="ws-about-section" id="about">
        <div className="container">
          <div className="row">
            <div className="ws-about-content clearfix">
              <div className="col-sm-8 col-sm-offset-2">
                <img src="assets/img/logo.png" className="img-responsive" />
                <h3>{document.data.headline[0].text}</h3>
                <div className="ws-separator"></div>
                {RichText.render(document.data.intro)}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Work collection start */}
      <section className="ws-works-section">
        <div className="container">
          <div className="ws-section-title">
            <h2>The Collection</h2>
            <div className="ws-separator"></div>
          </div>
          {groups.map((group, gi) => (
            <div className="ws-works-group" key={gi}>
              {group.name && (
                <div className="ws-category-bar">
                  <h3>{group.name}</h3>
                </div>
              )}
              <div className="row">
                {group.items.map((slice, index) => {
                  const title = slice.primary.title && slice.primary.title[0] ? slice.primary.title[0].text : '';
                  return (
                    <div className="col-sm-6 col-md-4 ws-works-item" key={index} style={{ transitionDelay: `${(index % 6) * 70}ms` }}>
                      <figure>
                        <button className="ws-works-thumb" onClick={() => setLightbox({ url: slice.primary.main_image.url, alt: slice.primary.main_image.alt, title })}>
                          <img src={thumb(slice.primary.main_image.url)} alt={slice.primary.main_image.alt || title} className="img-responsive" loading="lazy" />
                          <span className="ws-works-hover" aria-hidden="true"><span>View</span></span>
                        </button>
                      </figure>
                      <div className="ws-works-caption text-center">
                        <h3 className="ws-item-title">{title}</h3>

                        <div className="ws-item-separator"></div>

                        {/*<div className="ws-item-price">${(slice.primary.price).toFixed(2)}</div>*/}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Work collection end */}



      {/* Footer */}
      <div className="ws-footer-bar">
        <div className="container">
          <p>Folded Book Creations &copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>

      {lightbox && (
        <div className="ws-lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="ws-lightbox-close" onClick={() => setLightbox(null)}>&times;</button>
          <div className="ws-lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.alt} />
            {lightbox.title && <p className="ws-lightbox-title">{lightbox.title}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export async function getStaticProps() {
  // query() is empty on purpose!
  // https://prismic.io/docs/rest-api/query-the-api/query-all-documents
  // const res = await client.query('');
  //const res = await client.query('[at(document.type, "post")]')
  const home_page = await client.getSingle("home_page")

  return {
    props: {
      home_page
    },
  }
}
