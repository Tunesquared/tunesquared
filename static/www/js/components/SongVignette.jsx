/** @jsx React.DOM */
define(['react'], function(React){
	var SongVignette = React.createClass({

		onClick: function (evt) {
			evt.preventDefault();
			this.props.onClick(this.props.song);
		},

		render: function () {
			return (
				<div class="span3">
					<div class="song-vignette">
						<div class="img-container">
							<div class="img-action-overlay">
								<a href="#" onClick={this.onClick}>
									<img src="img/overlay-add.png" title="add to playlist" />
								</a>
							</div>
							<img src={this.props.song.thumb} />
						</div>
						<ul class="song-attributes">
							<li>
								<strong> {this.props.song.title} </strong>
							</li>
							<li>by {this.props.song.artist} </li>
						</ul>
					</div>
				</div>
			);
		}
	});

	return SongVignette;
});
