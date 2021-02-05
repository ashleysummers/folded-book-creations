import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { apiEndpoint, client } from '../prismic-configuration'
import {RichText} from 'prismic-reactjs'

export default function Home(props) {
  const document = props.home_page;
  console.log(document);

  return (
    <div className={styles.container}>
      <Head>
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

      {/* About Section */}
      <section className="ws-about-section">
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
          <div className="row">

          {document.data.body.map((slice, index) => {
            if (slice.slice_type === 'folded_book') {
              return (
                    
                      <div className="col-sm-6 col-md-4 ws-works-item" key={slice.uid}>
                      
                        
                        <figure>
                          <a href={slice.primary.main_image.url} target="new">
                          <img src={slice.primary.main_image.url} alt={slice.primary.main_image.alt} className="img-responsive" />
                          </a>
                        </figure>
                        <div className="ws-works-caption text-center">
                          <h3 className="ws-item-title">{slice.primary.title[0].text}</h3>

                          <div className="ws-item-separator"></div>

                          
                          <div className="ws-item-price">${(slice.primary.price).toFixed(2)}</div>
                        </div>
                      
                    </div>
                  )
                }
              }
          )}          
          </div>
        </div>
      </section>
      {/* Work collection end */}



      {/* Footer */}
      <div className="ws-footer-bar">
        <div className="container">
          <div className="pull-left">
            <p>Folded Book Creations &copy; 2020 All rights reserved.</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export async function getStaticProps() {
  // query() is empty on purpose!
  // https://prismic.io/docs/rest-api/query-the-api/query-all-documents
  // const res = await client.query('');
  //const res = await client.query('[at(document.type, "post")]')
  const home_page = await client.getSingle("home_page")
  console.log(home_page.data);


  return {
    props: {
      home_page
    },
  }
}