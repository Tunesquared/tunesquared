// Search View
// =============

// Includes file dependencies
define(['jquery', 'search/Search', 'search/YoutubeSource', "text!templates/searchresult.jst", "text!templates/popup.jst"],
    function($, SearchAggregator, YoutubeSource, searchResultTemplate, popupTemplate) {

        // make one list element

        var SearchResultView = Backbone.View.extend({

            tagName: 'li',

            events: {
                'click [ref=addToPlaylist]': 'onClick', //ref
                //'click a ': 'onClick',
                'click .addsong': 'AddSong',
                'click .close2': 'Close'
            },

            initialize: function() {
                _.bindAll(this, 'onClick', 'AddSong', 'Close');

                this.template = _.template(searchResultTemplate);

            },

            render: function() {
                console.log("render listel");
                listel = this.template({
                    result: this.model
                })

                this.$el.html(listel);

                this.$('[ref="asking"]').hide();


            },

            onClick: function(evt) {
                evt.preventDefault();

                this.$('[ref="asking"]').toggle();


                $('[ref="asking"] .addsong').button().buttonMarkup("refresh");
                $('[ref="asking"] .close2').button().buttonMarkup("refresh");


                /*

            $('#popups').empty();

            var result = this.model;

            var $popup = new PopupView({
                model: result,
            });

            $popup.render();

            $('#popups').append($popup.$el);

            var song = this.model;

            console.log(this.model); */

                // $('[ref="asking"] .addsong' ).button().buttonMarkup( "refresh" );
                // $('[ref="asking"] .close2' ).button().buttonMarkup( "refresh" );

                //$('#popup'+ song.data).popup().popup("open");


                //$('#popup'+ song.data).find($('.addSong')).on('click', this.mafonction(song.data));


                //$('#popup'+ song.data).button();

                // if(button==yes) close popup and add song to the playlist.

                //setTimeout( $('#popupBasic').popup("close"), 1500 );

                //app.getParty().get('playlist').songs.add(this.model);
            },

            AddSong: function(evt) {
                evt.preventDefault();
                console.log('addSong');
                this.trigger('addSong', this.model);
                this.$('[ref="asking"]').hide();


            },

            Close: function(evt) {
                evt.preventDefault();
                console.log("close popup");
                this.$('[ref="asking"]').hide();
            }
            /*
        mafonction: function(data){
            console.log("mafonction");
            // $('#popup'+ data).popup("close");

        }
*/

        });
        /*
    var PopupView = Backbone.View.extend({
        tagName: 'div',
        events:{
            'click .addsong': 'AddSong',
            'click .close2' : 'Close'
        },

        initialize: function() {
            _.bindAll(this, 'AddSong', 'Close');

            this.template = _.template(popupTemplate);






        },

        render: function() {
            console.log("render popup");
            popup = this.template({result: this.model});


            this.$el.html(popup);



        },
         AddSong: function(evt){
            evt.preventDefault();
            console.log('addSong');


        },

        Close: function(evt){
            evt.preventDefault();
            console.log("close popup")
        }




    }); */

        return Backbone.View.extend({

            dataLoading: false,
            keywords: '',
            CHUNK_SIZE: 20,
            sources: [],

            events: {
                'keydown :input': 'logKey'
            },

            initialize: function() {
                _.bindAll(this, 'loadResult', 'addSrc', 'removeSrc', 'disableSrc', 'addSong');

                this.searchAggregator = new SearchAggregator({
                    chunkSize: this.CHUNK_SIZE,
                    preloadThreshold: 3
                });

                this.searchAggregator.addSrc(YoutubeSource);

                this.addSrc(YoutubeSource);


            },

            setParty: function(party) {

                this.party = party;

            },

            loadResult: function(result) {
                console.log("loadResult function");

                $.mobile.loading('hide');


                var $result = new SearchResultView({
                    model: result,
                });
                $result.on('addSong', this.addSong);
                $result.render();

                this.$('#dynamicResults').append($result.$el);


                this.$('#dynamicResults').listview('refresh');
                //this.$('#popups').popup();
                this.dataLoading = false; // what is this?
            },

            addSong: function(song) {
                $.mobile.loading('show');
                this.party.get('playlist').add(song, {
                    success: function() {
                        $.mobile.loading('hide');
                        window.location.hash = '#party';
                    },
                    error: function() {
                        $.mobile.loading('hide');
                        window.location.hash = '#party'; //TODO: handel error

                    }
                });
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
                    console.log("An error as occured while searching - " + err);
                });
                this.queryIterator.exec();
            },


            render: function() {


                var self = this;

                SearchAggregator.util.fetchResults(this.queryIterator, this.CHUNK_SIZE, {
                    read: self.loadResult
                });

                /* Loader (it will be hidden by loadResult) */
                $.mobile.loading("show");

                return this;
            },

            logKey: function(e) {
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
                if (this.sources.indexOf(source) === -1) {
                    this.sources.push(source);
                }
                // And add the source to the search aggregator
                this.searchAggregator.addSrc(source);
            },
            removeSrc: function(source) {
                var index = this.sources.indexOf(source);
                if (index != -1) {
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
