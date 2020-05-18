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
      <div className='logo'>
        <a href='http://www.vicentelopez.gov.ar/' />
      </div>
      <div className='terminos'>
        <Link to='/s/terminos-y-condiciones'> Términos y condiciones
        </Link>
        <Link to='/s/reglamento'> Reglamento
        </Link>
      </div>
    </div>
  </footer>
)

export default Footer
