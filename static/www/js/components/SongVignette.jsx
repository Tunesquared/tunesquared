/** @jsx React.DOM */
define(['react'], function(React){
	var SongVignette = React.createClass({

		onClick: function (evt) {
			evt.preventDefault();
			this.props.onClick(this.props.song);
		},

		render: function () {
			return (
				<div class="media song-vignette">
					<a href="#" onClick={this.onClick}>
						<div class="pull-left">
							<div class="media-object">
								<div class="img-action-overlay hide">
									<img src="img/overlay-add.png" class="img-responsive" title="add to playlist" />
								</div>
								<img src={this.props.song.thumb} />
							</div>
						</div>
						<div class="media-body">
							<h4 class="media-heading">{this.props.song.title} </h4>
							by {this.props.song.artist}
						</div>
					</a>
				</div>
			);
		}
	});

	return SongVignette;
});
