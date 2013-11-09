
var Twitter = require('node-twitter'),
    account = require('../credentials/twitter'),
    EventEmitter = require('events').EventEmitter;

var client1 = new Twitter.StreamClient(
  account.twitter.consumer_key,
  account.twitter.consumer_secret,
  account.twitter.access_token_key,
  account.twitter.access_token_secret
);

client1.on( 'close', function(){
  console.log( 'Connection closed.' );
});

client1.on( 'end', function(){
  console.log( 'End of Line.' );
});

client1.on( 'error', function ( error ) {
  console.log( 'Error: ' + ( error.code ) ? error.code + ' ' + error.message : error.message );
});

function emit( label, tweet ) {
  console.log( '['+label+']', '['+tweet.user.lang+']',
    '@'+tweet.user.screen_name,
    '('+tweet.user.name + ')',
    ' -- "'+tweet.text+'"',
    ( tweet.place ) ? ' -- ' + tweet.place.full_name : ''
  );
}

var ev = new EventEmitter();
client1.on( 'tweet', function ( tweet ) {
  if( tweet && tweet.geo && tweet.geo.coordinates ){
    if( parseFloat( tweet.geo.coordinates[0] ) > 5.441022 &&
        parseFloat( tweet.geo.coordinates[0] ) < 19.601194 &&
        parseFloat( tweet.geo.coordinates[1] ) > 116.05957 &&
        parseFloat( tweet.geo.coordinates[1] ) < 127.265625 ){
      ev.emit( 'tweet_local', tweet );
      emit( 'TWEET.LOCAL', tweet );
    }
    else {
      ev.emit( 'tweet_overseas', tweet );
      emit( 'TWEET.OVERSEAS', tweet, tweet.geo.coordinates );
    }
  }
  ev.emit( 'tweet', tweet );
  emit( 'TWEET.NOGEO', tweet );
  if( tweet.coordinates ) console.error( 'NO GEO BUT YES COORDINATES!' );
});

client1.start(['#Haiyan','#Yolanda','#SuperTyphoon','#YolandaPH','#PrayForThePhilippines','#Pontevedra','#RescuePH']);
// client1.start(null,['116.05957,5.441022','127.265625,19.601194']);

module.exports = ev;