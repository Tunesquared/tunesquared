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
				<div class="navbar navbar-fixed-top">
					<div class="container">
					  <a class="navbar-brand" href="#">Tunes²</a>
					  <ul class="nav navbar-nav">
              <form class="form-inline" action="" onSubmit={this.onSearch}>
                <input type="text" id="search-field" class="form-control navbar-search" placeholder="Search" ref="search" />
              </form>
            </ul>
            <ul class="nav navbar-nav pull-right">
            	<li><a href="#" onClick={this.leave}><i class="icon-off"></i> exit</a></li>
            </ul>
				  </div>
        </div>
       );
		}
	});

	return Navbar;
});
