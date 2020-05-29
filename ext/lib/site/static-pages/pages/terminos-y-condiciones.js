import React, {Component} from 'react'
import Footer from   'ext/lib/site/footer/component'
import Jump from 'ext/lib/site/jump-button/component'
import Anchor from 'ext/lib/site/anchor'

export default class Page extends Component {
  componentDidMount () {
    this.goTop()
  }

  goTop () {
    Anchor.goTo('container')
  }

  render () {
    return (
      <div>
        <section className="banner-static">
          <div className="banner"></div>
          <div className='contenedor largo'>
            <div className='fondo-titulo'>
              <h1>Términos y Condiciones</h1>
            </div>
          </div>
        </section>
        <Anchor id='container'>
          <div className='ext-terminos-y-condiciones'>
            <h2><span>Descripción</span></h2>
            <p><span>Los siguientes Términos y Condiciones regulan el uso de la Plataforma UNR Presupuesto Participativo.</span></p>
            <p><span>El registro y uso de la plataforma por parte de los usuarios indica la aceptación absoluta de los Términos y Condiciones presentes y de la Política de Privacidad.</span></p>
            <p><span>La plataforma UNR Presupuesto Participativo es un sitio web que promueve la democracia interna  UNR Presupuesto Participativo. Esta herramienta favorece la generación de espacios de colaboración para co-diseñar y co-producir valor público.</span></p>

            <h2><span>Registro en la plataforma web</span></h2>
            <p><span>El ingreso a UNR Presupuesto Participativo no requiere registro online previo, el mismo será requerido si la/el usuaria/o desea publicar contenidos o interactuar con otros usuarios.</span></p>
            <p><span>Esperamos que te registres usando tu nombre. Las cuentas de "bots" u otros registros automáticos no están permitidas. Los usuarios son responsables de preservar la privacidad de su cuenta protegiendo el acceso a sus contraseñas. Por favor, ante cualquier ingreso indebido en tu cuenta, comunicate inmediatamente a través de <a href="mailto:presupuestoparticipativo@unr.edu.ar">presupuestoparticipativo@unr.edu.ar</a>.</span></p>

            <h2><span>Validación de usuarios</span></h2>
            <p><span>UNR Presupuesto Participativo se reserva el derecho de validar la información brindada por la/el usuaria/o al momento de la inscripción. En caso de que la información brindada no pueda validarse, Presupuesto Participativo se reserva el derecho de no dar de alta a ese usuario. Por su parte, Presupuesto Participativo deslinda su responsabilidad en el caso de no ser veraz la información suministrada al respecto.</span></p>
            <p><span>Al momento de la inscripción el usuario asume el compromiso y la responsabilidad de:</span></p>
            <ul>
              <li><span>No proporcionar información personal falsa ni crear cuentas a nombre de terceros sin autorización.</span></li>
              <li><span>No crear más de una cuenta personal.</span></li>
              <li><span>No compartir la contraseña ni permitir a otra persona acceda a su cuenta.</span></li>
              <li><span>Los usuarios se comprometen a notificar a UNR Presupuesto Participativo del uso no autorizado de su clave.</span></li>
              <li><span>UNR Presupuesto Participativo se reserva el derecho de rechazar cualquier solicitud de inscripción o de cancelar un registro previamente aceptado.</span></li>
            </ul>

            <h2><span>Usuarios, obligaciones y condiciones</span></h2>
            <p><span>La/El usuaria/o deberá respetar estos Términos y Condiciones de Uso. Las infracciones por acción u omisión de estos Términos y Condiciones de Uso generarán el derecho a favor de Presupuesto Participativo de suspender al usuario que las haya realizado.</span></p>
            <p><span>La/El usuaria/o es responsable del contenido que suba, publique o muestre en UNR Presupuesto Participativo, garantizando que el mismo no infringe derechos de terceros ni los Términos y Condiciones de Uso ni viola ninguna ley, reglamento u otra normativa. Los usuarios entienden y aceptan que el material y/o contenido que suba y/o publique podría ser utilizado por otros usuarios de la plataforma web y/o por terceras personas ajenas, y que UNR Presupuesto Participativo no será responsable en ningún caso por tales utilizaciones.</span></p>
            <p><span>La/El usuaria/o debe usar UNR Presupuesto Participativo en forma correcta y lícita. En caso contrario, UNR Presupuesto Participativo podrá retirar el contenido y/o suspender la cuenta de aquellos usuarios que incurran en actitudes contrarias a estos términos y condiciones y/o de la política de privacidad, ofensivas, ilegales, violatorias de derechos de terceros, contrarias a la moral y buenas costumbres y/o amenaza para la seguridad de otros usuarios.</span></p>
            <p><span>En relación a los aportes, colaboraciones y comentarios que los usuarios realicen con respecto a las iniciativas propuestas, las mismas no son de carácter vinculante, obligatorio y/o impositivo sobre las acciones de Universidad Nacional de Rosario.</span></p>

            <h2><span>Actividades Prohibidas</span></h2>
            <p><span>Las siguientes actividades, sean lícitas o ilícitas, se encuentran expresamente vedadas, sin perjuicio de las prohibiciones generales expuestas anteriormente:</span></p>
            <ul>
              <li><span>Hostigar, acosar, amenazar, acechar, realizar actos de vandalismo hacia otros Usuarios.</span></li>
              <li><span>Infringir los derechos a la intimidad de otros Usuarios.</span></li>
              <li><span>Solicitar información personal identificable de otros Usuarios con el propósito de hostigar, atacar, explotar, violar la intimidad de los mismos;</span></li>
              <li><span>Publicar de manera intencionada o con conocimiento injurias o calumnias;</span></li>
              <li><span>Publicar, con el intento de engañar, contenido que es falso o inexacto;</span></li>
              <li><span>Intentar usurpar la identidad de otro Usuario, representando de manera falsa su afiliación con cualquier individuo o entidad, o utilizar el nombre de otro Usuario con el propósito de engañar;</span></li>
              <li><span>Promover, defender o mostrar pornografía, obscenidad, vulgaridad, blasfemia, odio, fanatismo, racismo y/o violencia. En caso de sufrir alguna de estas situaciones, comunicarse con el Administrador a través de UNR Presupuesto Participativo</span></li>
              <li><span>Vulnerar los derechos establecidos en la Ley N° 25.326 de Protección de Datos Personales. ​</span></li>
            </ul>
            <p><span>En caso de sufrir alguna de estas situaciones, comunicarse con Presupuesto Participativo a través de  <a href="mailto:presupuestoparticipativo@unr.edu.ar">presupuestoparticipativo@unr.edu.ar</a>.</span></p>

            <h2><span>Moderación de la actividad en Presupuesto Participativo</span></h2>
            <p><span>La actividad en esta plataforma web contará con moderadores responsables de hacer cumplir estos Términos y Condiciones de Uso. Los mismos serán designados por Universidad Nacional de Rosario en pos de fomentar un diálogo franco y abierto que evite afrentas a personas o instituciones, material comercial no relacionado (SPAM) u otros desvíos de la intención original de Presupuesto Participativo.</span></p>
            <ul>
              <li><span>Rechazar o eliminar contenido que no cumpla cumpla con estos términos de uso o que, de alguna forma, sea cuestionable.</span></li>
              <li><span>Quitar el acceso a quien no cumpliera, de alguna forma, con estos términos de uso.</span></li>
            </ul>

            <h1><span>Políticas de Privacidad</span></h1>
            <p><span>La recolección y tratamiento de los datos personales tiene como finalidad conocer sobre el uso de Presupuesto Participativo y mejorar la propuesta.</span></p>
            <p><span>Universidad Nacional de Rosario no cederá a ninguna otra persona ni organismo los datos personales de los participantes, salvo orden judicial. Los datos recabados tienen por único objeto verificar que las propuestas sean presentadas por personas legalmente habilitadas para hacerlo y evitar abusos en el uso de la plataforma. Esta información será utilizada exclusivamente para obtener estadísticas generales de los usuarios.</span></p>

            <h3><span>Información proporcionada por los usuarios:</span></h3>
            <p><span>Las interacciones en UNR Presupuesto Participativo requiere que los usuarios se registren. En ese caso, se solicitará información personal, como nombre y apellido, documento, dirección legal y dirección de correo electrónico. El perfil que es visible públicamente puede incluir el nombre y la foto seleccionada.</span></p>
            <p><span>Asimismo, si un usuario se pone en contacto con UNR Presupuesto Participativo, es posible que guardemos constancia de la comunicación para poder resolver más fácilmente cualquier incidencia que se haya producido.</span></p>
            <p><span>Las direcciones de correo electrónico o cuenta de Facebook sólo se utilizarán para enviar notificaciones sobre el uso de la plataforma, avisos sobre futuras votaciones o consultas y otra información sobre el Presupuesto Participativo. No obstante, cada usuario podrá darse de baja en cualquier momento si así lo desea.</span></p>

            <h2><span>Información obtenida a partir del uso de la plataforma:</span></h2>
            <p><span>UNR Presupuesto Participativo puede recopilar información sobre la forma en que los usuarios usan la plataforma. Entre la información obtenida de esta forma, se incluye el tipo de navegador utilizado, la preferencias de lenguaje y, por ejemplo, los comentarios que ha realizado.</span></p>
            <p><span>UNR Presupuesto Participativo podrá compartir información de manera agregada, y en carácter no personal, con el público en general (por ejemplo, mostrar tendencias sobre el uso del sitio).</span></p>
            <p><span>UNR Presupuesto Participativo garantiza la debida protección de los datos personales almacenados en esta plataforma web así como también el acceso a la información registrada en el mismo, de conformidad a lo establecido en el artículo 43, párrafo tercero de la Constitución Nacional y la Ley N° 25.326 de Protección de los Datos Personales.</span></p>

            <p><span></span></p>
          </div>
        </Anchor>
        <Jump goTop={this.goTop} />
        <Footer />
      </div>
    )
  }
}
