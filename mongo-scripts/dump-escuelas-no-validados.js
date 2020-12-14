mails=[
"aca_los_emails"
]

/* Ejecutar haciendo túnel con servidor mongo a localhost:26017 y después:
mongo --quiet localhost:26017/ppunre-prod dump-users-escuelas.js > ppunr-escuelas-usuarios.csv
*/

print('Nombre,Apellido,Email,DNI,Escuelas,Claustro,Fecha de registro,Validado')

// cargamos diccionario con escuelas
let escuelas = {}
db.escuelas.find().forEach(e => escuelas[e._id] = e)

db.users.aggregate([
  {$match: { email: { $in: mails } } },
  // hacemos joins
  {$lookup: {
    from:'claustros',
    localField:'claustro',
    foreignField:'_id',
    as:'claustro'
  }},
  {$unwind: {path:'$claustro'} },
  {$sort: {createdAt: -1}}
]).forEach(u => {
	let d = u.createdAt 
	// convertimos a GMT-3
	d.setHours(d.getHours() - 3)
	print(
		`${u.firstName},` +
		`${u.lastName},` +
		`${u.email},` +
		`${u.dni},` +
		`"${u.escuelas.map(e => escuelas[e].nombre).join(',')}",` +
		`${u.claustro.nombre},` +
		`${d.toISOString()},` + 
		`${u.emailValidated?'S':'N'}`
	)
})
