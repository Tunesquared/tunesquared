define(['jquery', 'common/js/models/Song.js'], function($, Song) {
	function FakeSrc(query) {

        this.get = function(from, length, cb) {
            
            // Sets a timeout to better simulate a real source. However, instant source
            // may reveal intersting buggs ;)
            window.setTimeout(function(){
                data = [];
                for(i = from ; i < from+length ; i++) {
                    data.push(new Song({
                        title: "Resultat n°"+(i+1), 
                        src: 'Fake source'
                    }));
                }
                cb(null, data);
            }, 2000);
        }
	};
	FakeSrc.title = "FakeSrc";

	return FakeSrc;
});