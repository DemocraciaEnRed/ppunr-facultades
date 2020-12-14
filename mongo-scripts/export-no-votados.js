print('email,firstName,lastName')
db.users.find({emailValidated : true}).forEach(u=>{
  if (!db.votes.findOne({author:u._id}))
    print(`${u.email},${u.firstName},${u.lastName}`)
})
