print('Emails no validados')
db.users.find({emailValidated: false, createdAt: { "$gte" : { "$date" : "2020-08-01"}}})
print( db.users.find( {email:'it@democracyos.io'},{email:1,createdAt:1} ).toArray() )
db.users.find({email:'it@democracyos.org'},{email:1,createdAt:1}).toArray()
print(db.tokens.find({user:ObjectId("FFFFF")}))
