import React from 'react'
import { Link } from 'react-router'

const Footer = () => (
  <footer className='footer-static'>
    <div className='container'>
      <div className='contacto-detalles'>
        <h3>CONTACTO</h3>
        <p>
          <span>Coordinación y Secretaría Técnica PP UNR</span>
          <span>Maipú 1065</span>
          <span>Email para consultas: <a href="mailto:presupuestoparticipativo@unr.edu.ar">presupuestoparticipativo@unr.edu.ar</a></span>
        </p>
      </div>
      <div className='mapa-box'>
        <div>
          <iframe className='mapa' src="https://www.google.com/maps/embed/v1/place?q=universidad+nacional+de+rosario&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8" frameBorder="0" allowFullScreen/>
        </div>
      </div>
      <div className='social-icon'>
        <a className='social-facebook' href='https://facebook.com/unroficial/ ' target="_blank"/>
        <a className='social-instagram' href='https://instagram.com/unroficial/' target="_blank" />
        <a className='social-twitter' href='https://twitter.com/unroficial/' target="_blank" />
        <a className='social-mail' href='mailto:presupuestoparticipativo@unr.edu.ar' target="_blank"/>
      </div>
      <div className='logos'>
        <div className='logo-der'>
          <img src="/ext/lib/site/footer/logo-der.png" alt="Democracia en Red"/>
          <span>Desarrollado por<br /><b>Democracia en red</b></span>
        </div>
        <div className='logo'>
          <a className='logo-unr' href='https://www.unr.edu.ar/' />
          <div className='terminos'>
            <Link to='/s/terminos-y-condiciones'> Términos y condiciones
            </Link>
            <a href="https://presupuestoparticipativo.unr.edu.ar/?page_id=1551" rel="noopener noreferer" target="_blank"> Reglamento
            </a>
          </div>
        </div>
        <div className='logo-flor'>
          <img src="/ext/lib/site/footer/logo-flor.png" alt="Flor"/>
        </div>
        <div className='logo-universidad'>
          <img src="/ext/lib/site/footer/logo-universidad-que-queremos.png" alt="Universidad que queremos"/>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
