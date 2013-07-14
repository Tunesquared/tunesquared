/*
    Search.js : iterator class used to get search results from various sources
    
    TODO : detect when individual sources come to end to keep consistent chunks sizes
*/
define(['jquery', 'common/models/Song', 'common/js/util/YoutubeSource.js', 'common/js/util/FakeSource.js', 'underscore'], function($, Source, YoutubeSource, FakeSrc, Song){
    
    var Search = function(config){
    
        this.chunkSize = this.DEFAULT_CHUNK_SIZE;
        this.preloadThreshold = this.DEFAULT_PRELOAD_THRESHOLD;
        
        if(config)
            this.config(config);
        
        var sources = {};
        
        this.addSrc = function(srcs){
            
            if(Object.prototype.toString.call( srcs ) !== '[object Array]') srcs = [srcs];
            
            for(var i in srcs){
                var source = srcs[i];
                var title = source.title ? source.title : source;
                if(typeof(source) === 'string') {
                    source = Search.util.mapToSource(source);
                    console.log(source);
                }
                sources[title] = source;
            }
            
            return this;
        };

        
        this.removeSrc = function(srcs){
            if(Object.prototype.toString.call( srcs ) !== '[object Array]') srcs = [srcs];
            
            for(var i in srcs){
                var source = srcs[i];
                var title = source.title ? source.title : source;
                delete sources[title];
            }
            
            return this;
        };
        
        this.hasSource = function(src){
            var title = src.title ? src.title : src;
            return typeof(sources[title]) !== 'undefined';
        };

        this.getSources = function() {
            return sources;
        };
        
        this.query = function(query){
            var parent = this;
            
            var Query = function(chunkSize, preloadThreshold){
                var cache = {};
                var isEnd = false;
                var cacheSize = 0;
                var chunkBegin = 0;
                var currentChunkSize = 0;
                var nbFetchings = 0;
                var cursor = 0;
                var fetching = false;
                var cSources = []; // concrete sources
                var activeSources = [];

                this.isEnd = function(){
                    return isEnd;
                };
                
                this.hasNext = function(){
                    return cacheSize != 0;
                };
                
                /* Returns the next result or null if nothing is available */
                this.next = function(){
                    if(!this.hasNext())
                        return null;
                    
                    cursor = (++cursor >= activeSources.length) ? 0 : cursor;
                    var key = activeSources[cursor];
                    
                    if(cache[key].length > 0){
                        cacheSize --;
                        if(cacheSize == 0 && activeSources.length == 0){
                            this.isEnd = true;
                            this.trigger("end");
                        } else if(cacheSize < preloadThreshold && !fetching && activeSources.length > 0){
                            this.p_fetchNextChunk();
                        }
                        return cache[key].splice(0, 1)[0];
                    }
                    else
                        return this.next();
                };
                
                
                this.p_fetchNextChunk = function(){
                    fetching = true;
                    nbFetchings = activeSources.length;
                    currentChunkSize = Math.round(chunkSize/activeSources.length)
                    for(var i = 0 ; i < activeSources.length ; i++){
                        this.p_fetchSource(activeSources[i], chunkBegin, currentChunkSize);
                    }
                }
                
                this.p_fetchSource = function(title, begin, size){
                    var called = false;
                    cSources[title].get(begin, size, $.proxy(function(err, data){
                        if(!called){
                            called = true;
                            if(err){
                                this.trigger('error', err);
                                parent.trigger('error');
                                activeSources.splice(activeSources.indexOf(title), 1);
                            } else if(data.length == 0){
                                activeSources.splice(activeSources.indexOf(title), 1);
                            } else {
                                cache[title] = cache[title].concat(data);
                                cacheSize += data.length;
                            }
                            
                            this.p_fetchSourceEnd();
                        } else {
                            console.log("Debug : search callback called twice");
                        }
                    }, this));
                }
                
                this.p_fetchSourceEnd = function(){
                    nbFetchings --;
                    if(nbFetchings == 0){
                        fetching = false;
                        chunkBegin += currentChunkSize;
                        if(cacheSize > 0){
                            this.trigger('data');
                        } else if(activeSources == 0){
                            isEnd = true;
                            this.trigger('end');
                        } else {
                            this.p_fetchNextChunk();
                        }
                    }
                }
                
                this.exec = function(){
                
                    var s_cache = cache;
                    for(var i in sources){
                        cSources[i] = new sources[i](query);
                        activeSources.push(i);
                        
                        cache[i] = new Array();
                    }
                    
                    this.p_fetchNextChunk();
                    return this;
                }
                
                _.bindAll(this, 'p_fetchSource', 'p_fetchNextChunk', 'p_fetchSourceEnd', 'exec');
            };
            
            _.extend(Query.prototype, Backbone.Events);
            
            return new Query(this.chunkSize, this.preloadThreshold);
        }
        
    };
    
    Search.prototype.config = function(conf){
        if(conf.chunkSize) this.chunkSize = conf.chunkSize;
        if(conf.preloadThreshold) this.preloadThreshold = conf.preloadThreshold;
    }
    
    // Search utilities
    Search.util = {
        /*  
            Fetches an certain "amount" of results from "query" passing them as arguments of
            the read() callback passed in the hash of parameters "param".
            "param" can contain the following values :
                read : function(item), use this to read values from the search
                done : function(), called when the amount of results has been read
                end : function(), called when there is no more data to read from the query
        */
        fetchResults: function(query, amount, param){
            if(!param) param = {};  //Callbacks
            for(var i = 0 ; i < amount ; i++){
                
                // There is no more data to be read or if an error occured
                if(query.isEnd()){
                    if(typeof(param.end) == 'function') param.end();
                }
                
                // The data we want is not yet loaded
                if(!query.hasNext()){
                    if(typeof(param.loading) == 'function') param.loading();
                    // When new data comes, we try again reading our results
                    query.once('data', function(){
                        Search.util.fetchResults(query, amount - i, param);
                    });
                    return;
                }
                // We read the next element
                var el = query.next();
                if(typeof(param.read) == 'function') param.read(el);
            }
            if(typeof(param.done) == 'function') param.done();
        }, 

        /* Maps a string representing the source name to the source object itself */
        mapToSource: function(srcTitle) {
            srcTitle = srcTitle.toLowerCase();
            var mapping = {
                'youtube': YoutubeSource, 
                'fakesrc': FakeSrc
            };
            for(var name in mapping) {
                if(name == srcTitle) {
                    return mapping[name];
                }
            }
            return false;
        }
    
    };
    
    Search.prototype.DEFAULT_CHUNK_SIZE = 20;
    Search.prototype.DEFAULT_PRELOAD_THRESHOLD = 10;
    
    _.extend(Search.prototype, Backbone.Events);
    
    return Search;
});