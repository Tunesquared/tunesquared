/** @jsx React.DOM */
'use strict';

define(['react'], function(React){
	var Navbar = React.createClass({

		onSearch: function (evt) {
			evt.preventDefault();
			window.location.href = '#search/'+encodeURIComponent(this.refs.search.getValue());
		},

		render: function(){
			return (
				<div class="navbar">
            <div class="navbar-inner">
                <ul class="nav">
                    <form class="navbar-search pull-left" action="" onSubmit={this.onSearch}>
                        <input type="text" id="search-field" class="search-query span2" placeholder="Search" ref="search" />
                    </form>
                </ul>
            </div>
        </div>
       );
		}
	});

	return Navbar;
});
