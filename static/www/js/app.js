'use strict';

define(['jquery', 'react', 'components/App', 'models/Session', 'controllers/PubSubController'],
	function($, React, App, Session, PubSubCtrl) {

  mixpanel.track('show desktop');
  var session = new Session();
  new PubSubCtrl(session);

  /* We can still use jquery to make sure the dom is completely loaded even though
      it's very unlikely it isn't already loaded. */
  $(function() {
      React.renderComponent(
        App({session: session}),
        document.getElementById('app')
      );
  });
});
