/*
  Provides suggestions based on most popular tunes.
  ...
  No just kidding, right now it's just plain json
*/
'use strict';

var framework = require('../../framework');

/*
  Hard coded suggestion data...
*/
var suggestions = [{
  "name": "Rock",
  "thumb": "/img/pl_thumbs/rock.png",
  "songs": [{
    "source": "youtube",
    "data": "2a4gyJsY0mc",
    "title": "Electric Six - Danger! High Voltage",
    "thumb": "http://i1.ytimg.com/vi/2a4gyJsY0mc/0.jpg"
  }, {
    "source": "youtube",
    "data": "etAIpkdhU9Q",
    "title": "AC/DC - Hells Bells",
    "thumb": "http://i1.ytimg.com/vi/etAIpkdhU9Q/0.jpg"
  }, {
    "source": "youtube",
    "data": "Rbm6GXllBiw",
    "title": "Guns N' Roses - Paradise City",
    "thumb": "http://i1.ytimg.com/vi/Rbm6GXllBiw/0.jpg"
  }, {
    "source": "youtube",
    "data": "hTWKbfoikeg",
    "title": "Nirvana - Smells Like Teen Spirit",
    "thumb": "http://i1.ytimg.com/vi/hTWKbfoikeg/0.jpg"
  }, {
    "source": "youtube",
    "data": "1mxaA-bJ35s",
    "title": "Creedence Clearwater Revival: Suzie Q",
    "thumb": "http://i1.ytimg.com/vi/1mxaA-bJ35s/0.jpg"
  }, {
    "source": "youtube",
    "data": "Vppbdf-qtGU",
    "title": "ZZ Top - La Grange",
    "thumb": "http://i1.ytimg.com/vi/Vppbdf-qtGU/0.jpg"
  }, {
    "source": "youtube",
    "data": "VxldtR106Sg",
    "title": "You Me at Six - Lived A Lie",
    "thumb": "http://i1.ytimg.com/vi/VxldtR106Sg/0.jpg"
  }, {
    "source": "youtube",
    "data": "1w7OgIMMRc4",
    "title": "Guns N' Roses - Sweet Child O' Mine",
    "thumb": "http://i1.ytimg.com/vi/1w7OgIMMRc4/0.jpg"
  }, {
    "source": "youtube",
    "data": "pAgnJDJN4VA",
    "title": "ACDC - Back in Black",
    "thumb": "http://i1.ytimg.com/vi/pAgnJDJN4VA/0.jpg"
  }, {
    "source": "youtube",
    "data": "o1tj2zJ2Wvg",
    "title": "Guns N' Roses - Welcome To The Jungle",
    "thumb": "http://i1.ytimg.com/vi/o1tj2zJ2Wvg/0.jpg"
  }, {
    "source": "youtube",
    "data": "kDWgsQhbaqU",
    "title": "My Chemical Romance - Welcome to the Black Parade",
    "thumb": "http://i1.ytimg.com/vi/kDWgsQhbaqU/0.jpg"
  }, {
    "source": "youtube",
    "data": "X0Zn6cVv4p0",
    "title": "Deaf Havana - Mildred (Lost A Friend)",
    "thumb": "http://i1.ytimg.com/vi/X0Zn6cVv4p0/0.jpg"
  }, {
    "source": "youtube",
    "data": "3YxaaGgTQYM",
    "title": "Evanescence - Bring Me To Life",
    "thumb": "http://i1.ytimg.com/vi/3YxaaGgTQYM/0.jpg"
  }, {
    "source": "youtube",
    "data": "2tmc8rJgxUI",
    "title": "Gun's N' Roses - Knockin On Heavens Door",
    "thumb": "http://i1.ytimg.com/vi/2tmc8rJgxUI/0.jpg"
  }, {
    "source": "youtube",
    "data": "yF-GvT8Clnk",
    "title": "Portishead - glory box",
    "thumb": "http://i1.ytimg.com/vi/yF-GvT8Clnk/0.jpg"
  }, {
    "source": "youtube",
    "data": "-XNFokmDKrE",
    "title": "Electric six - Gay bar",
    "thumb": "http://i1.ytimg.com/vi/-XNFokmDKrE/0.jpg"
  }, {
    "source": "youtube",
    "data": "w9TGj2jrJk8",
    "title": "Led Zeppelin - Stairway To Heaven",
    "thumb": "http://i1.ytimg.com/vi/w9TGj2jrJk8/0.jpg"
  }, {
    "source": "youtube",
    "data": "NdYWuo9OFAw",
    "title": "Goo Goo Dolls - Iris",
    "thumb": "http://i1.ytimg.com/vi/NdYWuo9OFAw/0.jpg"
  }, {
    "source": "youtube",
    "data": "q_MwX1hlMls",
    "title": "Ki:Theory - Stand By Me",
    "thumb": "http://i1.ytimg.com/vi/q_MwX1hlMls/0.jpg"
  }, {
    "source": "youtube",
    "data": "BfOdWSiyWoc",
    "title": "Red Hot Chili Peppers - Can't Stop",
    "thumb": "http://i1.ytimg.com/vi/BfOdWSiyWoc/0.jpg"
  }, {
    "source": "youtube",
    "data": "HgzGwKwLmgM",
    "title": "Queen - Don't Stop Me Now",
    "thumb": "http://i1.ytimg.com/vi/HgzGwKwLmgM/0.jpg"
  }, {
    "source": "youtube",
    "data": "1cQh1ccqu8M",
    "title": "Nickelback - How You Remind Me",
    "thumb": "http://i1.ytimg.com/vi/1cQh1ccqu8M/0.jpg"
  }, {
    "source": "youtube",
    "data": "kXYiU_JCYtU",
    "title": "Linkin Park - Numb",
    "thumb": "http://i1.ytimg.com/vi/kXYiU_JCYtU/0.jpg"
  }, {
    "source": "youtube",
    "data": "CD-E-LDc384",
    "title": "Metallica - Enter Sandman",
    "thumb": "http://i1.ytimg.com/vi/CD-E-LDc384/0.jpg"
  }, {
    "source": "youtube",
    "data": "lDK9QqIzhwk",
    "title": "Bon Jovi - Livin' On A Prayer",
    "thumb": "http://i1.ytimg.com/vi/lDK9QqIzhwk/0.jpg"
  }, {
    "source": "youtube",
    "data": "5anLPw0Efmo",
    "title": "Evanescence - My Immortal",
    "thumb": "http://i1.ytimg.com/vi/5anLPw0Efmo/0.jpg"
  }, {
    "source": "youtube",
    "data": "zhAmug6Ts6o",
    "title": "Muse - Time Is Running Out",
    "thumb": "http://i1.ytimg.com/vi/zhAmug6Ts6o/0.jpg"
  }, {
    "source": "youtube",
    "data": "W-TE_Ys4iwM",
    "title": "Bastille - Pompeii",
    "thumb": "http://i1.ytimg.com/vi/W-TE_Ys4iwM/0.jpg"
  }, {
    "source": "youtube",
    "data": "zhAmug6Ts6o",
    "title": "The Prodigy -",
    "thumb": "http://i1.ytimg.com/vi/zhAmug6Ts6o/0.jpg"
  }, {
    "source": "youtube",
    "data": "W-TE_Ys4iwM",
    "title": "30 Seconds to Mars",
    "thumb": "http://i1.ytimg.com/vi/W-TE_Ys4iwM/0.jpg"
  }, {
    "source": "youtube",
    "data": "fJ9rUzIMcZQ",
    "title": "Queen - Bohemian Rhapsody",
    "thumb": "http://i1.ytimg.com/vi/fJ9rUzIMcZQ/0.jpg"
  }, {
    "source": "youtube",
    "data": "Soa3gO7tL-c",
    "title": "Green Day - Boulevard Of Broken Dreams",
    "thumb": "http://i1.ytimg.com/vi/Soa3gO7tL-c/0.jpg"
  }]
}, {
  "name": "Indie Folk",
  "thumb": "/img/pl_thumbs/folk.png",
  "songs": [{
    "source": "youtube",
    "data": "vSkb0kDacjs",
    "title": "Woodkid - Iron",
    "thumb": "http://i1.ytimg.com/vi/vSkb0kDacjs/0.jpg"
  }, {
    "source": "youtube",
    "data": "rGKfrgqWcv0",
    "title": "Mumford and Sons - I Will Wait",
    "thumb": "http://i1.ytimg.com/vi/rGKfrgqWcv0/0.jpg"
  }, {
    "source": "youtube",
    "data": "Bag1gUxuU0g",
    "title": "Lana de Rey - Born To Die",
    "thumb": "http://i1.ytimg.com/vi/Bag1gUxuU0g/0.jpg"
  }, {
    "source": "youtube",
    "data": "Pib8eYDSFEI",
    "title": "The XX - Crystalised",
    "thumb": "http://i1.ytimg.com/vi/Pib8eYDSFEI/0.jpg"
  }, {
    "source": "youtube",
    "data": "XFkzRNyygfk",
    "title": "Radiohead - Creep",
    "thumb": "http://i1.ytimg.com/vi/XFkzRNyygfk/0.jpg"
  }, {
    "source": "youtube",
    "data": "PQZhN65vq9E",
    "title": "Florence + the Machine - You've Got the Love",
    "thumb": "http://i1.ytimg.com/vi/PQZhN65vq9E/0.jpg"
  }, {
    "source": "youtube",
    "data": "Lh3TokLzzmw",
    "title": "Coldplay - Atlas",
    "thumb": "http://i1.ytimg.com/vi/Lh3TokLzzmw/0.jpg"
  }, {
    "source": "youtube",
    "data": "g1s47L8DrJ0",
    "title": "Bob Dylan - Like a Rolling Stone",
    "thumb": "http://i1.ytimg.com/vi/g1s47L8DrJ0/0.jpg"
  }, {
    "source": "youtube",
    "data": "Lp1fQ51YZMM",
    "title": "Artic Monkeys - Mardy Bum",
    "thumb": "http://i1.ytimg.com/vi/Lp1fQ51YZMM/0.jpg"
  }, {
    "source": "youtube",
    "data": "nnxPKY7NSoM",
    "title": "The Tallest Man on Earth - The Dreamer",
    "thumb": "http://i1.ytimg.com/vi/nnxPKY7NSoM/0.jpg"
  }, {
    "source": "youtube",
    "data": "ssdgFoHLwnk",
    "title": "Bon Iver - Skinny Love",
    "thumb": "http://i1.ytimg.com/vi/ssdgFoHLwnk/0.jpg"
  }, {
    "source": "youtube",
    "data": "R8OOWcsFj0U",
    "title": "Muse - Undisclosed Desires",
    "thumb": "http://i1.ytimg.com/vi/R8OOWcsFj0U/0.jpg"
  }, {
    "source": "youtube",
    "data": "gnhXHvRoUd0",
    "title": "Kings of Leon - Use Somebody",
    "thumb": "http://i1.ytimg.com/vi/gnhXHvRoUd0/0.jpg"
  }, {
    "source": "youtube",
    "data": "pkeDBwsIaZw",
    "title": "London Grammar - Wasting My Young Years",
    "thumb": "http://i1.ytimg.com/vi/pkeDBwsIaZw/0.jpg"
  }, {
    "source": "youtube",
    "data": "nehRB1FTeTo",
    "title": "The Beatles - Strawberry Fields Forever",
    "thumb": "http://i1.ytimg.com/vi/nehRB1FTeTo/0.jpg"
  }, {
    "source": "youtube",
    "data": "2fngvQS_PmQ",
    "title": "Ed Sheeran - I See Fire",
    "thumb": "http://i1.ytimg.com/vi/2fngvQS_PmQ/0.jpg"
  }, {
    "source": "youtube",
    "data": "yFTvbcNhEgc",
    "title": "Angus and Julia - Big Jet Plane",
    "thumb": "http://i1.ytimg.com/vi/yFTvbcNhEgc/0.jpg"
  }, {
    "source": "youtube",
    "data": "r8OipmKFDeM",
    "title": "Oasis - Don't Look Back In Anger",
    "thumb": "http://i1.ytimg.com/vi/r8OipmKFDeM/0.jpg"
  }, {
    "source": "youtube",
    "data": "dAuAyA9dBBU",
    "title": "Milky Chance - Stolen Dance",
    "thumb": "http://i1.ytimg.com/vi/dAuAyA9dBBU/0.jpg"
  }, {
    "source": "youtube",
    "data": "zvCBSSwgtg4",
    "title": "The Lumineers - Ho Hey",
    "thumb": "http://i1.ytimg.com/vi/zvCBSSwgtg4/0.jpg"
  }, {
    "source": "youtube",
    "data": "2CZ8ossU4pc",
    "title": "Regina Spektor - All The Rowboats",
    "thumb": "http://i1.ytimg.com/vi/2CZ8ossU4pc/0.jpg"
  }, {
    "source": "youtube",
    "data": "TmxSxKxBbQE",
    "title": "Xavier Rudd - Spirit Bird",
    "thumb": "http://i1.ytimg.com/vi/TmxSxKxBbQE/0.jpg"
  }, {
    "source": "youtube",
    "data": "CGyEd0aKWZE",
    "title": "Laura Marling - Rambling Man",
    "thumb": "http://i1.ytimg.com/vi/CGyEd0aKWZE/0.jpg"
  }, {
    "source": "youtube",
    "data": "DeumyOzKqgI",
    "title": "Adele - Skyfall",
    "thumb": "http://i1.ytimg.com/vi/DeumyOzKqgI/0.jpg"
  }]
}, {
  "name": "Pop",
  "thumb": "/img/pl_thumbs/pop.png",
  "songs": [{
    "source": "youtube",
    "data": "nPvuNsRccVw",
    "title": "Bruno Mars - Treasure",
    "thumb": "http://i1.ytimg.com/vi/nPvuNsRccVw/0.jpg"
  }, {
    "source": "youtube",
    "data": "TH2tp72T13o",
    "title": "Justin Timberlake - Mirrors",
    "thumb": "http://i1.ytimg.com/vi/TH2tp72T13o/0.jpg"
  }, {
    "source": "youtube",
    "data": "lWA2pjMjpBs",
    "title": "Rihanna - Diamonds",
    "thumb": "http://i1.ytimg.com/vi/lWA2pjMjpBs/0.jpg"
  }, {
    "source": "youtube",
    "data": "CGyEd0aKWZE",
    "title": "Ellie Goulding - Burn",
    "thumb": "http://i1.ytimg.com/vi/CGyEd0aKWZE/0.jpg"
  }, {
    "source": "youtube",
    "data": "hHUbLv4ThOo",
    "title": "Pitbull - Timber ft. Ke$ha",
    "thumb": "http://i1.ytimg.com/vi/hHUbLv4ThOo/0.jpg"
  }, {
    "source": "youtube",
    "data": "v9uDwppN5-w",
    "title": "Demi Lovato - Neon Lights",
    "thumb": "http://i1.ytimg.com/vi/v9uDwppN5-w/0.jpg"
  }, {
    "source": "youtube",
    "data": "6cfCgLgiFDM",
    "title": "Christina Aguilera - Your Body",
    "thumb": "http://i1.ytimg.com/vi/6cfCgLgiFDM/0.jpg"
  }, {
    "source": "youtube",
    "data": "nlcIKh6sBtc",
    "title": "Lorde - Royals",
    "thumb": "http://i1.ytimg.com/vi/nlcIKh6sBtc/0.jpg"
  }, {
    "source": "youtube",
    "data": "NOubzHCUt48",
    "title": "KeSha - Die Young",
    "thumb": "http://i1.ytimg.com/vi/NOubzHCUt48/0.jpg"
  }, {
    "source": "youtube",
    "data": "e-fA-gBCkj0",
    "title": "Bruno Mars - Locked Out of Heaven",
    "thumb": "http://i1.ytimg.com/vi/e-fA-gBCkj0/0.jpg"
  }, {
    "source": "youtube",
    "data": "lVQ_981plpE",
    "title": "Katy Perry - Dark Horse",
    "thumb": "http://i1.ytimg.com/vi/lVQ_981plpE/0.jpg"
  }, {
    "source": "youtube",
    "data": "yyDUC1LUXSU",
    "title": "Robin Thicke - Blurred Lines",
    "thumb": "http://i1.ytimg.com/vi/yyDUC1LUXSU/0.jpg"
  }, {
    "source": "youtube",
    "data": "b-3BI9AspYc",
    "title": "Rihanna - What Now",
    "thumb": "http://i1.ytimg.com/vi/b-3BI9AspYc/0.jpg"
  }, {
    "source": "youtube",
    "data": "f2JuxM-snGc",
    "title": "Lorde - Team",
    "thumb": "http://i1.ytimg.com/vi/f2JuxM-snGc/0.jpg"
  }, {
    "source": "youtube",
    "data": "tg00YEETFzg",
    "title": "Rihanna - We Found Love (feat. Calvin Harris)",
    "thumb": "http://i1.ytimg.com/vi/tg00YEETFzg/0.jpg"
  }, {
    "source": "youtube",
    "data": "My2FRPA3Gf8",
    "title": "Miley Cyrus - Wrecking Ball",
    "thumb": "http://i1.ytimg.com/vi/My2FRPA3Gf8/0.jpg"
  }, {
    "source": "youtube",
    "data": "n-D1EB74Ckg",
    "title": "Selena Gomez - Come & Get It",
    "thumb": "http://i1.ytimg.com/vi/n-D1EB74Ckg/0.jpg"
  }, {
    "source": "youtube",
    "data": "UJtB55MaoD0",
    "title": "Jessie J - Domino",
    "thumb": "http://i1.ytimg.com/vi/UJtB55MaoD0/0.jpg"
  }, {
    "source": "youtube",
    "data": "W-TE_Ys4iwM",
    "title": "One Direction - Story of My Life",
    "thumb": "http://i1.ytimg.com/vi/W-TE_Ys4iwM/0.jpg"
  }, {
    "source": "youtube",
    "data": "CevxZvSJLk8",
    "title": "Katy Perry - Roar",
    "thumb": "http://i1.ytimg.com/vi/CevxZvSJLk8/0.jpg"
  }, {
    "source": "youtube",
    "data": "DEzREJbln-o",
    "title": "Justin Timberlake - Take Back the Night",
    "thumb": "http://i1.ytimg.com/vi/DEzREJbln-o/0.jpg"
  }, {
    "source": "youtube",
    "data": "SSbBvKaM6sk",
    "title": "Blur - Song 2",
    "thumb": "http://i1.ytimg.com/vi/SSbBvKaM6sk/0.jpg"
  }, {
    "source": "youtube",
    "data": "pw8PpYBiDsc",
    "title": "Gorillaz - Feel Good Inc ft. De La Soul",
    "thumb": "http://i1.ytimg.com/vi/pw8PpYBiDsc/0.jpg"
  }]
}, {
  "name": "Dance",
  "thumb": "/img/pl_thumbs/dance.png",
  "songs": [{
    "source": "youtube",
    "data": "5NV6Rdv1a3I",
    "title": "Daft Punk - Get Lucky",
    "thumb": "http://i1.ytimg.com/vi/5NV6Rdv1a3I/0.jpg"
  }, {
    "source": "youtube",
    "data": "YxIiPLVR6NA",
    "title": "Avicii - Hey Brother",
    "thumb": "http://i1.ytimg.com/vi/YxIiPLVR6NA/0.jpg"
  }, {
    "source": "youtube",
    "data": "oABEGc8Dus0",
    "title": "Rudimental - Feel the Love (ft. John Newman)",
    "thumb": "http://i1.ytimg.com/vi/oABEGc8Dus0/0.jpg"
  }, {
    "source": "youtube",
    "data": "rLBJZuao17o",
    "title": "DJ Snake & Lil Jon - Turn Down For What",
    "thumb": "http://i1.ytimg.com/vi/rLBJZuao17o/0.jpg"
  }, {
    "source": "youtube",
    "data": "5TUIciKQzxI",
    "title": "Disclosure - F For You",
    "thumb": "http://i1.ytimg.com/vi/5TUIciKQzxI/0.jpg"
  }, {
    "source": "youtube",
    "data": "m-M1AtrxztU",
    "title": "Clean Bandit - Rather Be (ft. Jess Glynne)",
    "thumb": "http://i1.ytimg.com/vi/m-M1AtrxztU/0.jpg"
  }, {
    "source": "youtube",
    "data": "gCYcHz2k5x0",
    "title": "Martin Garrix - Animals",
    "thumb": "http://i1.ytimg.com/vi/gCYcHz2k5x0/0.jpg"
  }, {
    "source": "youtube",
    "data": "9c3EQhtf9-U",
    "title": "Storm Queen - Look Right Through",
    "thumb": "http://i1.ytimg.com/vi/9c3EQhtf9-U/0.jpg"
  }, {
    "source": "youtube",
    "data": "yZqmarGShxg",
    "title": "Calvin Harris & Alesso - Under Control (ft. Hurts)",
    "thumb": "http://i1.ytimg.com/vi/yZqmarGShxg/0.jpg"
  }, {
    "source": "youtube",
    "data": "m-M1AtrxztU",
    "title": "Clean Bandit - Rather Be (ft. Jess Glynne)",
    "thumb": "http://i1.ytimg.com/vi/m-M1AtrxztU/0.jpg"
  }, {
    "source": "youtube",
    "data": "iEXSxUraLCI",
    "title": "Sub Focus - Turn Back Time",
    "thumb": "http://i1.ytimg.com/vi/iEXSxUraLCI/0.jpg"
  }, {
    "source": "youtube",
    "data": "NF-kLy44Hls",
    "title": "Daft Punk - Lose Yourself to Dance",
    "thumb": "http://i1.ytimg.com/vi/NF-kLy44Hls/0.jpg"
  }, {
    "source": "youtube",
    "data": "47dtFZ8CFo8",
    "title": "Capital Cities - Safe and Sound",
    "thumb": "http://i1.ytimg.com/vi/47dtFZ8CFo8/0.jpg"
  }, {
    "source": "youtube",
    "data": "IcrbM1l_BoI",
    "title": "Avicii - Wake Me Up",
    "thumb": "http://i1.ytimg.com/vi/IcrbM1l_BoI/0.jpg"
  }, {
    "source": "youtube",
    "data": "MmZexg8sxyk",
    "title": "MGMT - Electril Feel",
    "thumb": "http://i1.ytimg.com/vi/MmZexg8sxyk/0.jpg"
  }, {
    "source": "youtube",
    "data": "UxxajLWwzqY",
    "title": "Icona Pop - I Love It (ft. Charlie XCX)",
    "thumb": "http://i1.ytimg.com/vi/UxxajLWwzqY/0.jpg"
  }, {
    "source": "youtube",
    "data": "CevxZvSJLk8",
    "title": "Empire of the Sun - Walking on a Dream",
    "thumb": "http://i1.ytimg.com/vi/CevxZvSJLk8/0.jpg"
  }, {
    "source": "youtube",
    "data": "79YDgv_zWA4",
    "title": "Klangkarussell - Sonnentanz ft. Will Heard",
    "thumb": "http://i1.ytimg.com/vi/79YDgv_zWA4/0.jpg"
  }, {
    "source": "youtube",
    "data": "oiKj0Z_Xnjc",
    "title": "Stromae - Papaoutai",
    "thumb": "http://i1.ytimg.com/vi/oiKj0Z_Xnjc/0.jpg"
  }, {
    "source": "youtube",
    "data": "CLXt3yh2g0s",
    "title": "Example - Changed the Way You Kiss Me",
    "thumb": "http://i1.ytimg.com/vi/CLXt3yh2g0s/0.jpg"
  }, {
    "source": "youtube",
    "data": "I9QGpHScGug",
    "title": "Wilkinson - Afterglow",
    "thumb": "http://i1.ytimg.com/vi/I9QGpHScGug/0.jpg"
  }, {
    "source": "youtube",
    "data": "3O1_3zBUKM8",
    "title": "Naugthy Boy - La La La (ft. Sam Smith)",
    "thumb": "http://i1.ytimg.com/vi/3O1_3zBUKM8/0.jpg"
  }, {
    "source": "youtube",
    "data": "NIcW36J-h7Q",
    "title": "Fatboy Slim, Riva Starr & Beardyman - Eat Sleep Rave Repeat",
    "thumb": "http://i1.ytimg.com/vi/NIcW36J-h7Q/0.jpg"
  }, {
    "source": "youtube",
    "data": "5dbEhBKGOtY",
    "title": "David Guetta - Play Hard (ft. Ne-Yo & Akon)",
    "thumb": "http://i1.ytimg.com/vi/5dbEhBKGOtY/0.jpg"
  }, {
    "source": "youtube",
    "data": "1y6smkh6c-0",
    "title": "Swedish House Mafia - Don't You Worry Child",
    "thumb": "http://i1.ytimg.com/vi/1y6smkh6c-0/0.jpg"
  }, {
    "source": "youtube",
    "data": "clRjbYa4UWQ",
    "title": "Hardwell feat Matthew Koma - Dare You",
    "thumb": "http://i1.ytimg.com/vi/clRjbYa4UWQ/0.jpg"
  }, {
    "source": "youtube",
    "data": "tg00YEETFzg",
    "title": "Rihanna - We Found Love (ft. Calvin Harris)",
    "thumb": "http://i1.ytimg.com/vi/tg00YEETFzg/0.jpg"
  }, {
    "source": "youtube",
    "data": "fe4EK4HSPkI",
    "title": "MGMT - Kids",
    "thumb": "http://i1.ytimg.com/vi/fe4EK4HSPkI/0.jpg"
  }, {
    "source": "youtube",
    "data": "BR_DFMUzX4E",
    "title": "Armin van Buuren - This Is What It Feels Like",
    "thumb": "http://i1.ytimg.com/vi/BR_DFMUzX4E/0.jpg"
  }, {
    "source": "youtube",
    "data": "ppy-fgbPn2s",
    "title": "Hardwell - Call Me a Spaceman",
    "thumb": "http://i1.ytimg.com/vi/ppy-fgbPn2s/0.jpg"
  }, {
    "source": "youtube",
    "data": "hN5X4kGhAtU",
    "title": "Empire of the Sun - We Are the People",
    "thumb": "http://i1.ytimg.com/vi/hN5X4kGhAtU/0.jpg"
  }, {
    "source": "youtube",
    "data": "0z7omu2UNVA",
    "title": "Netsky - Come Alive",
    "thumb": "http://i1.ytimg.com/vi/0z7omu2UNVA/0.jpg"
  }]
}];

new framework.Router({
  'api/suggestions': function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    res.send(suggestions);
  }
});
