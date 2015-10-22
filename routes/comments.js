var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'), //mongo connection
  bodyParser = require('body-parser'), //parses information from POST
  methodOverride = require('method-override'); //used to manipulate POST
router.use(bodyParser.urlencoded({
  extended: true
}));
async = require('async');
router.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

router.route('/')
  //GET all messages

  .post(function(req, res) {
    // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    var content = req.body.content;
    var dob = req.body.dob;
    var user_id = req.body.user_id;
    var messageID = req.body.message_id;
    //call the create function for our database
    mongoose.model('comment').create({
      content: content,
      user_id: user_id,
      dob: dob,
      message_id: messageID

    }, function(err, message) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      } else {
        //message has been created
        console.log(req.body);
        console.log('POST creating new comment: ' + comment);

          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          res.format({
                      //HTML response will render the index.jade file in the views/comments folder. We are also setting "comments" to be an accessible variable in our jade view
                    html: function(){
                        res.render('messages/show');
                    },
                    //JSON response will show all comments in JSON format
                    json: function(){
                        res.json(comments);
                    }
                });

      }
    });
  });


module.exports = router;
