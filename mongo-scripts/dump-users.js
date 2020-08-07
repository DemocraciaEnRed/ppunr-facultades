/* Ejecutar haciendo túnel con servidor mongo a localhost:26017 y después:
mongo --quiet localhost:26017/ppunr-prod dump-users.js > ppunr-facultades-usuarios.csv
mongo --quiet localhost:26017/ppunre-prod dump-users.js > ppunr-escuelas-usuarios.csv
*/

print('Nombre,Apellido,Email,Fecha de registro,Validado')

db.users.find().sort({createdAt: -1}).forEach(u => {
	let d = u.createdAt 
	// convertimos a GMT-3
	d.setHours(d.getHours() - 3)
	print(
		`${u.firstName},` +
		`${u.lastName},` +
		`${u.email},` +
		`${d.toISOString()},` + 
		`${u.emailValidated?'S':'N'}`
	)
})
