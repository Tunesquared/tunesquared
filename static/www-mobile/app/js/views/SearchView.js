// Search View
// =============

// Includes file dependencies
define(['jquery', 'search/Search', 'search/YoutubeSource', "text!templates/searchresult.jst"], 
	function($, SearchAggregator, YoutubeSource, searchResultTemplate){

		// make one list element

	var SearchResultView = Backbone.View.extend({

        tagName: 'li',

        events: {
            //'click [data-action=addToPlaylist]': 'onClick'
            'click': 'onClick'
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
            
            console.log(this.model);

            $('#popupBasic').popup("open");
            //setTimeout( $('#popupBasic').popup("close"), 1500 );

            //app.getParty().get('playlist').songs.add(this.model);
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
            
            var $result = new SearchResultView({
                model: result, 
            });
            $result.render();
            this.$('#dynamicResults').append($result.$el);

            this.$('#dynamicResults').listview('refresh');
            
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

