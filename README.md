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

