/** @jsx React.DOM */
define(['react'], function(React){
	var SongVignette = React.createClass({

		onClick: function (evt) {
			evt.preventDefault();
			this.props.onClick(this.props.song);
		},

		render: function () {
			return (
				<a href="#" onClick={this.onClick} class="song-vignette">
					<div class="song-thumb">
						<div class="song-thumb-overlay">
						</div>
						<img src={this.props.song.thumb} />
					</div>
					<div class="song-title">
						{this.props.song.title}
					</div>
				</a>
			);
		}
	});

	return SongVignette;
});
