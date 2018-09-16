class Friend {

    constructor(name, photo, scores) {
        this.name = name
        this.photo = photo
        this.scores = scores
    }

    set name(name) {
        if(name) {
            this._name = name
        } else {
            this._name = "Anonymous"
        }
    }

    get name() {
        return this._name
    }

    get photo() {
        return this._photo
    }

    set photo(photo) {
        if(photo) {
            this._photo = photo
        } else {
            this._photo = "https://transhumane-partei.de/wp-content/uploads/2016/04/blank-profile-picture-973461_960_720-250x250.png"
        }
    }

    set scores(scores) {
        if(scores) {
            this._scores = scores
        } else {
            this._scores = []
        }
    }

    get scores() {
        return this._scores
    }

    inspect() {
        return JSON.stringify(this);
    }

}

//
// saveFriend :: (String, String, [Number]) -> Friend
// 
// Creates a new Friend object with the information provided and stores it in the Array.
//
// name   - String holding the person's name
// photo  - String holding the URL pointing the the person's photo
// scores - List of numerical answers to given questions to determine affinity
//
// returns: Newly created Friend
// 
function saveFriend(name, photo, scores) {
    let friend = new Friend(name, photo, scores);
    friendList.push(friend);
    return friend;
}

//
// calculateAffinity :: ([Number], [Number]) -> Number
// 
// Calculate the sum of the absolute value difference of the list of numbers.
//
// lscores - List of scores for Friend 1
// rscores - List of scores for Friend 2
//
// returns: Affinity value (1000 as default for empty or undefined set of scores)
// 
function calculateAffinity(lscores, rscores) {
    if(lscores && 
       rscores && 
       (lscores.length > 0) && 
       (lscores.length === rscores.length)) {
        return lscores.map((element,index) => Math.abs(element - rscores[index])).reduce((a, b) => a + b);
    } else {
        return 1000;
    }
}

class FriendAndAffinity {

    constructor(friend, affinity) {
        this._friend = friend
        this._affinity = affinity
    }

    get friend() {
        return this._friend;
    }

    get affinity() {
        return this._affinity;
    }

    inspect() {
        return JSON.stringify(this);
    }
}

//
// getFriendAndAffinity :: (Friend, [Number]) -> FriendAndAffinity
// 
// Pair the friend with its affinity value.
//
// friend - Friend to calculate the affinity values
// scores - Values to use for calculating affinity
//
// returns: A pair of Friend and Affinity value
//
function getFriendAndAffinity(friend, scores) {
    return new FriendAndAffinity(friend, calculateAffinity(friend.scores, scores));
}

//
// getMinimumAffinityDifference :: (Friend, Friend) -> Friend
// 
// Using affinity (difference between scores), return the friend with the smallest affinity value.
//
// friend1 - Friend to compare
// friend2 - Friend to compare
//
// returns: Friend with the least affinity difference
// 
function getMinimumAffinityDifference(friend1, friend2) {
    if(friend1.affinity < friend2.affinity) {
        return friend1;
    } else {
        return friend2;
    }
}

function isSamePerson(friend1, friend2) {
    return (friend1 && friend2 && (JSON.stringify(friend1) === JSON.stringify(friend2)));
}


//
// findBestMatch :: ([Friend], Friend) -> Maybe[Friend]
// 
// Using affinity (difference between scores), find the person in the Array (excluding the given person)
// with the least difference.
//
// friends - List of Friends
// friend  - Friend to look best matches for
//
// returns: Friend with the least affinity difference or null if none found
// 
function findBestMatchInFriendsList(friends, friend) {
    if(friend && friends) {
        let friendsWithoutProvided = friends.filter((f) => !(isSamePerson(f,friend)));
        if(friendsWithoutProvided.length > 0) {
            let friendsWithAffinity = friendsWithoutProvided.map((f) => getFriendAndAffinity(f, friend.scores));
            if(friendsWithAffinity.length == 0) {
                return null;
            } else if(friendsWithAffinity.length == 1) {
                return friendsWithAffinity[0].friend;
            } else {
                return friendsWithAffinity.reduce(getMinimumAffinityDifference).friend;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

var friendList = [
    {
        name: "Kermit the frog",
        photo: "https://pbs.twimg.com/profile_images/812485522958520320/ONJ4bld1_400x400.jpg",
        scores:[5,1,4,4,5,1,2,5,4,1]
    } 
    ];

module.exports = {
    friends: friendList,
    saveFriend: saveFriend,
    findBestMatch: function(friend) {
        return findBestMatchInFriendsList(friendList, friend);
    }

}