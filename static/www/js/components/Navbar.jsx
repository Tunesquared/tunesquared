/** @jsx React.DOM */
'use strict';

define(['react'], function(React){
	var Navbar = React.createClass({

		onSearch: function (evt) {
			evt.preventDefault();
			window.location.href = '#search/'+encodeURIComponent(this.refs.search.getValue());
		},

		leave: function (evt) {
			evt.preventDefault();

			// We own this party so destroying it will make us leave cleanly
			this.props.session.get('party').destroy({
				success: function () {
					console.log('test');
					window.location.reload();
				}
			});
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
                <ul class="nav pull-right">
                	<li><a href="#" onClick={this.leave}><i class="icon-off"></i> exit</a></li>
                </ul>
            </div>
        </div>
       );
		}
	});

	return Navbar;
});
