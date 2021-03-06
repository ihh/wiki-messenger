var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    bcrypt = require('bcrypt');

passport.serializeUser(function(player, done) {
  done(null, player.id);
});

passport.deserializeUser(function(id, done) {
  Player.findOne({ id: id } , function (err, player) {
    done(err, player);
  });
});

passport.use
(new LocalStrategy
 ({ usernameField: 'name',
    passwordField: 'password' },
  function(name, password, done) {
    
    Player.findOne({ name: name }, function (err, player) {
      if (err) { return done(err); }
      if (!player) {
        return done(null, false, { message: 'Incorrect player name.' });
      }

      bcrypt.compare(password, player.password, function (err, res) {
        if (!res)
          return done(null, false, {
            message: 'Invalid Password'
          });
        var returnPlayer = PlayerService.makeLoginSummary (player)
        return done(null, returnPlayer, {
          message: 'Logged In Successfully'
        });
      });
    });
  }
 ));

/*
passport.use
(new FacebookStrategy
 ({// clientID: "client ID",
   // clientSecret: "client secret",
   // callbackURL: "http...",
    enableProof: false },

  function (accessToken, refreshToken, profile, done) {

    PlayerService.makeUniquePlayerName (profile.displayName)
      .then (function (name) {
        Player.findOrCreate ({ facebookId: profile.id },
                             { facebookId: profile.id,
                               displayName: profile.displayName,
                               name: name,
                               password: Math.random()
                             },
                             function (err, player) {
                               
                               if (err || !player)
                                 return done(err)
                               
                               return done(null, player, {
                                 message: 'Logged In Successfully'
                               });
                             })
      })
  }))
*/
