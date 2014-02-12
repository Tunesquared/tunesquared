/** @jsx React.DOM */
'use strict';

define(['react', 'mixins/Backbone'], function(React, BackboneMixin){
	var PlaylistItem = React.createClass({
		mixins: [BackboneMixin],

		getBackboneModels: function () {
			return [this.props.song];
		},

		onDestroy: function (evt) {
			evt.preventDefault();
			this.props.song.destroy();
		},

		upVote: function(evt) {
			evt.preventDefault();

			this.props.song.voteYes();
		},

		downVote: function(evt) {
			evt.preventDefault();

			this.props.song.voteNo();
		},

		render: function () {
			var song = this.props.song.toJSON();

			var yesLabel = (song.vote === 'yes')? 'label label-success disabled' : 'label-success label';
			var noLabel = (song.vote === 'no')? 'label label-danger disabled' : 'label-danger label';
			return (
				<div onClick={this.onClick} class="song-vignette">
					<a class="song-remove" onClick={this.onDestroy} href="#">
						<i class="icon-remove"></i>
					</a>
					<div class="song-thumb">
						<img src={song.thumb} />
					</div>
					<div class="song-title">
						{song.title}
					</div>
					<div class="song-votes">
						<a href="#" onClick={this.upVote} class={yesLabel}><i class="icon-thumbs-up"></i>{' '+song.votes_yes}</a>{' '}
						<a href="#" onClick={this.downVote} class={noLabel}><i class="icon-thumbs-down"></i>{' '+song.votes_no}</a>
					</div>
				</div>
			);
		}
	});

	return PlaylistItem;
});
