var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
    router.use(bodyParser.urlencoded({ extended: true }));
    async = require('async');

router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for messages
//this will be accessible from http://127.0.0.1:3000/messages if the default route for / is left unchanged
router.route('/')
    //GET all messages
    .get(function(req, res, next) {
        //retrieve all messages from Monogo
        mongoose.model('message').find({}, function (err, messages) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/messages folder. We are also setting "messages" to be an accessible variable in our jade view
                    html: function(){
                        res.render('messages/index', {
                              title: 'All my messages',
                              "messages" : messages,

                          });
                    },
                    //JSON response will show all messages in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
              }
        });
    })
    //POST a new message
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var dob = req.body.dob;
        var user_id = req.body.user_id;
        //call the create function for our database
        mongoose.model('message').create({
            name : name,
            dob : dob,
            user_id : user_id,

            }, function (err, message) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //message has been created
                  console.log(req.body);
                  console.log('POST creating new message: ' + message);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("messages");
                        // And forward to success page
                        res.redirect("/messages");
                    },
                    //JSON response will show the newly created message
                    json: function(){
                        res.json(message);
                    }
                });
              }
        })
    });



  router.get('/new', function(req, res) {
    mongoose.model('user').find({}, function (err, users) {
          if (err) {
              return console.error(err);
          } else {
              //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
              res.format({
                  //HTML response will render the index.jade file in the views/messages folder. We are also setting "messages" to be an accessible variable in our jade view
                html: function(){
                    res.render('messages/new', {
                          title: 'New Message',
                          "users" : users,
                      });
                },
                //JSON response will show all messages in JSON format
                json: function(){
                    res.json(users);
                }
            });
          }
    });
  });

  // route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('message').findById(id, function (err, message) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(message);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('message').findById(req.id, function (err, message) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + message._id);
        var messagedob = message.dob.toISOString();
        messagedob = messagedob.substring(0, messagedob.indexOf('T'))
        res.format({
          html: function(){
              res.render('messages/show', {
                "messagedob" : messagedob,
                "message" : message
              });
          },
          json: function(){
              res.json(message);
          }
        });
      }
    });
  });
  router.get('/:id/edit',function(req, res) {
    //mongoose.model('Message').findById(req.id).populate('user_id').exec(function(error, results) {});

      var messageQuery = mongoose.model('message').findById(req.id );
      var userQuery = mongoose.model('user').find({});


      var resources = {
        message: messageQuery.exec.bind(messageQuery),
        users: userQuery.exec.bind(userQuery)
      };
      async.parallel(resources, function (error, results) {
        if (error) {
          res.status(500).send(error);
          return;
        }
        console.log(results);
        res.render('messages/edit', results);
      });
    });
  //GET the individual message by Mongo ID
/*router.get('/:id/edit', function(req, res) {
    //search for the message within Mongo
    mongoose.model('message').findById(req.id, function (err, message) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the message
            console.log('GET Retrieving ID: ' + message._id);
            //format the date properly for the value to show correctly in our edit form
          var messagedob = message.dob.toISOString();
          messagedob = messagedob.substring(0, messagedob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('messages/edit', {
                          title: 'message' + message._id,
                        "messagedob" : messagedob,
                          "message" : message,
                          });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(message);
                 }
            });
        }

    });
});

router.get('/:id/edit', function(req, res) {
   mongoose.model('user').find({}, function (err, users) {
         if (err) {
             return console.error(err);
         } else {
             //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
             res.format({
                 //HTML response will render the index.jade file in the views/messages folder. We are also setting "messages" to be an accessible variable in our jade view
               html: function(){
                   res.render('messages/edit', {
                         title: 'New Message',
                         "users" : users,
                     });
               },
               //JSON response will show all messages in JSON format
               json: function(){
                   res.json(users);
               }
           });
         }
   });
 });
*/
//PUT to update a message by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var dob = req.body.dob;
    var user_id = req.body.user_id;

   //find the document by ID
        mongoose.model('message').findById(req.id, function (err, message) {
            //update it
            message.update({
              name : name,
              dob : dob,
              user_id : user_id
            }, function (err, messageID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/messages/" + message._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(message);
                         }
                      });
               }
            })
        });
});

//DELETE a message by ID
router.delete('/:id/edit', function (req, res){
    //find message by ID
    mongoose.model('message').findById(req.id, function (err, message) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            message.remove(function (err, message) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + message._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/messages");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : message
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;
