jQuery(document).ready(function($) {
  $('#flickr-photos').jflickrfeed({
    limit: 18,
    qstrings: {
      id: '52203464@N07'
    },
    itemTemplate:
      '<li>' +
      '<a class="lightly" href="{{image_b}}" title="{{title}}">' +
      '<img src="{{image_s}}" alt="{{title}}" />' +
      '</a>' +
      '</li>'
  }, function(data) {
    $('#flickr-photos a').lightly({
      'backgroundColor':'0,0,0',
			'backgroundOpacity':'0.5'
    });
  });
});
