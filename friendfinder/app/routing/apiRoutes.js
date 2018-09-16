var friendsData = require("../data/friends.js");

class BestMatchResponse {
    constructor(friend) {
        if(friend) {
            this._found = true;
            this._friend = friend;    
        } else {
            this._found = false;
            this._friend = null;    
        }
    }

    get found() {
        return this._found;
    }

    get friend() {
        return this._friend;
    }
}

class ListFriendsResponse {
    constructor(friends) {
        if(friends && (friends.length > 0)) {
            this._found = true;
            this._friends = friends;    
        } else {
            this._found = false;
            this._friends = [];    
        }
    }

    get found() {
        return this._found;
    }

    get friends() {
        return this._friends;
    }
}

module.exports = function(app) {
    app.get("/api/friends", function(req, res) {
      res.json(new ListFriendsResponse(friendsData.friends));
    });
  
    app.post("/api/friends", function(req, res) {
      if (req.body) {
          try {
              let surveyInput = req.body;
              let name = surveyInput.name;
              let photo = surveyInput.photo;
              let scores = surveyInput.scores;
              let friend = friendsData.saveFriend(surveyInput.name, surveyInput.photo, surveyInput.scores);
              res.json(new BestMatchResponse(friendsData.findBestMatch(friend)));
          } catch(e) {
            console.log("Requesting friend matching failed: " + e);
            res.json(new BestMatchResponse(null));
          }
      } else {
        console.log("Requesting friend matching failed: Null req.body");
        res.json(new BestMatchResponse(null));
      }
    });
  
}
  