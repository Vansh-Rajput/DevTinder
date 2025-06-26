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


# _123 is the password where _ is first alphabet of name