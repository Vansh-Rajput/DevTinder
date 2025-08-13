
# About DevTinder
- DevTinder is a full-stack web application that connects developers based on shared interests, skills, and projects—similar to how Tinder matches users.

- It features user authentication, profile creation, skill-based search, and real-time chat using React, Redux, Node.js, Express, MongoDB, and Socket.IO.

- The app allows developers to swipe through profiles, send connection requests, and collaborate on ideas instantly.



# Devtinder API's

-dividing our apis into routers using expressRouter, putting all the apis together is nota best practise

 authRouter
- post /login
- post /signup
- post /logout

  profileRouter
- get/profile/edit
- patch/profile/edit
- patch/profile/password
  
  connection req Router

- post /request/send/:status/:userId      can use this dynamically where status is either ignored,interested
things to consider in this case :-
- duplicate requests again n again.
- if a user sent u a req, you cannot send in return {considering u didnt responded the req of user initially}
- sending req to person who doesnt exist in DB

- post /request/review/accepted/:requestId
- post /request/review/rejected/:requestId


  userRouter
- get /connections
- the connections that u will show would be either send or received by logged in user, so showing used fromuser or touser may give incorrect results, so check carefully, else loggedin user would be printed

- get /requests/received


- get/user/feed -> show others people cards, but with some constraints
- constraints for cards :-
- dont show your own card
- NO connections {accepted, rejected}
- already sent/received req from someone


- PAGINATION
- /feed?page=1&limit=10  .skip(0) & .limit(10)
- /feed?page=2&limit=10  .skip(10) & .limit(10)
- /feed?page=3&limit=10  .skip(20) & .limit(10)

skip=(page no. -1 * limit)
 

# About GET,POST ETC...

- POST, GET, etc., are just names — in the end, you as the developer can write any logic inside any route.
  But there's an important catch:
  In real-world systems, it's not just about code working — it's about following standards and expectations.

- your team at production may find your code confusing if you would use any logic inside get,post...
- firewalls treat get,post req differently, changing there behav might cause issues..



# About Routes in Express
- Avoid using '/' on top as it will over write all other routes if mentioned, it works like a wildcard....
- use it at last, and provide rest of the unique routes first...

- if you use '/hello' route, then /hello/....anything.... will also now work like a wildcard not /helloanything.
{ONLY FOR app.use() not get,post as they work only for specific path}....

- whenever we are making typing any url on browser, we are making a GET api call or using a GET method...
- res.send() is response sent back to client once task is done, its not something stored in server...
- .use() can handle any type of method, wheather its post,delete,get etc...

- we can also provide more then 1 handlers (req,res,next)=>{} in the method, but use res.send() in one of them only else it will error no matter what,
- to switch to next handler, use next() method...

- req is not just a normal variable — it's a special object created by Express for each incoming request, and Express passes it along the middleware chain. useful in passing information from middleware to app. api's..


- req.query --> req.query is an object that contains query parameters sent in the URL after a ?

-  http://localhost:3000/search?term=burger&location=delhi
    In this case:
req.query = {
  term: 'burger',
  location: 'delhi'
}

- const app=express() means that we have created a server instance, its like main control center for our backend
 server, all api calls we made will be received by file which contains this express().....

 

# difference in .use() and .all()
Feature	app.use(path, handler)	app.all(path, handler)
Route Matching -> ✅ Prefix-based (matches /path and anything after)	❌ Exact match (unless you manually add /*)
HTTP Methods   ->	All methods	                                          All methods


# JSON vs JS Object

- json is used for data exhange through apis, data here is almost stored in string.
- cant use any function,variables or comments.
- use double quotes for all keys and values (mandatory)

- used as data struc in js.
- can use func,variables.
- not mandatory to use "", used when members have spaces.


# bcrypt
- a password hashing function used to keep our pass secure in DB, instead of storing password in plain text we keep hashed password.
- salt refers to random data to represent our password, no. of salt rounds tell how many times our password and salt was procossed, more salt rounds more strong hashing but more time to compute.



# JWT and Cookies
- when we login, a jwt token is created wrapped inside a cookie, then we use it each time api request is made, server validates it and gives us service.

- cookie act as a data carrier while jwt stores it.

- app.use(cookieParser) is used to read cookies sent by client(browser) to the server.
- res.cookie() means sending cookies from server to client
- Browser stores the cookie and automatically includes it in future requests to the same server.
- jwt.sign() is used for creating jwt tokens at server side, it has 2 parameters-- payload object and secret string, payload object means what info we want to keep hidden in our token.
- when we login and then again login with some other user crendential, the previous token will get replaced and we will see the latest user logged in inside '/profile' api


# why your Auth middleware in auth.js is special?
- if you add this middleware to any api, ex- app.use() , all() etc... ,then this api would only work if user is logged in....



# Ref in database
- we can create reference from one table to another using "ref" keyword in our schemma.
- .populate actually replaces field data with referenced data from other collection.
- by using populate we could display the fields of User table, but we dont want to display the whole object as it contains email,password or other personal details...
- Mongoose does not know you're referring to the email field inside the User model. By default, .populate() always looks for _id. so its recommended to go with id instead of email,names etc.....


# $nin (not include), $ne (not equal)
- both are helpful in nested queries..

- Meaning: Match documents and objects where the value of field is not in the specified array.

- Match documents where the value of field is not equal to value.


# _123 is the password where _ is first alphabet of name


# Setting Up Sockets.io
- make a http server using express and use server.listen instead of app.listen.
- create initializesocket function to setup socket.io.
- now create socket event handlers inside io.on
- use .emit to send msg and .on to receive them on backend

- after we sent to details to backend through socket.emit in frontend, how will now backend send these details to target user?

- now to display create array of objects and then use map to display all messages, you will receive every msg of sender and receiver through "msg received" handler in socket.js.....


# other features to add in chats
- online symbol for connection

