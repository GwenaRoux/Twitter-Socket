const socket = io();
const cont = document.querySelector('#container');
// Récupération
socket.on('tweet', function (tweet) {
    if (!isReply(tweet.tweet) === true) {
        console.log(tweet);
    var tweetbody = {
        // get extended full text if there's any
        'text': tweet.tweet.text,
        'userScreenName': "@" + tweet.tweet.user.screen_name,
        'userImage': tweet.tweet.user.profile_image_url_https,
        'userDescription': tweet.tweet.user.description,
    };
    try {
        // if(tweet.tweet.entities.media[0].media_url_https) {
        //     tweetbody['image'] = tweet.tweet.entities.media[0].media_url_https;
        // }
    } catch(err) { }
        console.log(tweetbody.text);
        /////////////////////////////////////////////
        createtweet(tweetbody)
    }
});

function createtweet(tweetbody) {
    var tweetcont = document.createElement('div');
    tweetcont.classList.add('tweetcont');
    var img = document.createElement('img');
    img.src = tweetbody.userImage;
    var username = document.createElement('h4');
    username.innerHTML = tweetbody.userScreenName;
    var p = document.createElement('p');
    p.innerHTML = tweetbody.text;
    tweetcont.appendChild(img);
    tweetcont.appendChild(username);
    tweetcont.appendChild(p);
    cont.appendChild(tweetcont);
}

function isReply(tweet) {
    if ( tweet.retweeted_status
        || tweet.in_reply_to_status_id
        || tweet.in_reply_to_status_id_str
        || tweet.in_reply_to_user_id
        || tweet.in_reply_to_user_id_str
        || tweet.in_reply_to_screen_name )
        return true
}
