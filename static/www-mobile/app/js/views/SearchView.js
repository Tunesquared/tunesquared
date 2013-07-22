// Search View
// =============

// Includes file dependencies
define(['jquery', 'search/Search', 'search/YoutubeSource', "text!templates/searchresult.jst", "text!templates/popup.jst"], 
	function($, SearchAggregator, YoutubeSource, searchResultTemplate, popupTemplate){

		// make one list element

	var SearchResultView = Backbone.View.extend({

        tagName: 'li',

        events: {
            'click [data-action=addToPlaylist]': 'onClick'
            //'click a ': 'onClick',
        },
        
        initialize: function() {
            _.bindAll(this, 'onClick');
            
            this.template = _.template(searchResultTemplate);
            
        }, 
        
        render: function() {
            console.log("render listel");
            listel = this.template({result: this.model})

            this.$el.html(listel);

            
        },
        
        onClick: function(evt){
            evt.preventDefault();

            var song = this.model;
            
            console.log(this.model);

            $('#popup'+ song.data +' .addsong' ).button().buttonMarkup( "refresh" );
            $('#popup'+ song.data + ' .close2' ).button().buttonMarkup( "refresh" );

            $('#popup'+ song.data).popup().popup("open");         

            //$('#popup'+ song.data).button();

            // if(button==yes) close popup and add song to the playlist.

            //setTimeout( $('#popupBasic').popup("close"), 1500 );

            //app.getParty().get('playlist').songs.add(this.model);
        },

        
    });

    var PopupView = Backbone.View.extend({
        tagName: 'div',
        events:{
            'click .addsong': 'AddSong',
            'click .close2' : 'Close'
        },

        initialize: function() {
            _.bindAll(this, 'AddSong', 'Close');
            
            this.template = _.template(popupTemplate);

            popup = this.template({result: this.model});
            

            this.$el.html(popup);


         
            
        }, 

        render: function() {
            console.log("render popup");
            
          

            
        },

        AddSong: function(evt){
            evt.preventDefault();
            console.log('addSong');


        },

        Close: function(evt){
            evt.preventDefault();
            console.log("close popup")
        }


    });

    return Backbone.View.extend({

        dataLoading: false,
        keywords: '', 
        CHUNK_SIZE: 20,
        sources: [], 

        events: {
            'keydown :input': 'logKey'
        },
    
        initialize: function () {
            _.bindAll(this, 'loadResult', 'addSrc', 'removeSrc', 'disableSrc');

            this.searchAggregator = new SearchAggregator({
                    chunkSize: this.CHUNK_SIZE, 
                    preloadThreshold: 3
            });

            this.searchAggregator.addSrc(YoutubeSource);
            
            this.addSrc(YoutubeSource);


        },

        loadResult: function(result) {
            console.log("loadResult function");

            $.mobile.loading('hide');
            
            var $popup = new PopupView({
                model: result,
            });
            
            var $result = new SearchResultView({
                model: result, 
            });
            $result.render();
            $popup.render();
            this.$('#dynamicResults').append($result.$el);
            this.$('#popups').append($popup.$el);

            this.$('#dynamicResults').listview('refresh');
            //this.$('#popups').popup();
            this.dataLoading = false; // what is this?
        },


        search: function(keywords) {
            //Modification 1
            console.log("searching");
            this.$('#dynamicResults').empty();
            this.keywords = keywords;
            this.queryIterator = this.searchAggregator.query(this.keywords);
            console.log("searching2");
            this.queryIterator.on('end', $.proxy(function() {
                //this.loader.hide();
                this.$el.find('#dynamicResults').append('No results were found.');
            }, this));
            this.queryIterator.on('error', function(err) {
                console.log("An error as occured while searching - "+err);
            })
            this.queryIterator.exec();
        }, 
    

        render: function () {


        	var self = this;

            SearchAggregator.util.fetchResults(this.queryIterator, this.CHUNK_SIZE, {
                read: self.loadResult
            });

            /* Loader (it will be hidden by loadResult) */
            $.mobile.loading( "show" );

            return this;
        },

        logKey: function(e){
            if (e.keyCode == 13) {
                e.preventDefault();
                
                var toAdd = $('input[id="search-1"]').val();
                //this.search(toAdd);
                console.log(toAdd);
                location.hash = "#search/" + toAdd;
            };
        },

        addSrc: function(source) {
            var source = source.title ? source : SearchAggregator.util.mapToSource(source);

            // If it is not just disabled, it's not in the sources array, we add it
            if(this.sources.indexOf(source) === -1) {
                this.sources.push(source); 
            }
            // And add the source to the search aggregator
            this.searchAggregator.addSrc(source);
        }, 
        removeSrc: function(source) {
            var index = this.sources.indexOf(source);
            if(index != -1) {
                this.sources.slice(index, 1);
            }
            this.searchAggregator.removeSrc(source);
        }, 

        /* Disables a source : keeps it in the local sources array (so it remains in the source select dropdown)
        * but removes it from the search aggregator so the result does not include the source anymore */
        disableSrc: function(source) {
            this.searchAggregator.removeSrc(source);
        }
    });
});

