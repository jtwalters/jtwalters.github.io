jQuery(document).ready(function($) {
  $('#flickr-photos').jflickrfeed({
    limit: 18,
    qstrings: {
      id: '52203464@N07'
    },
    itemTemplate:
      '<li>' +
      '<a rel="colorbox" href="{{image_b}}" title="{{title}}">' +
      '<img src="{{image_s}}" alt="{{title}}" />' +
      '</a>' +
      '</li>'
  }, function(data) {
    $('#flickr-photos a').colorbox({
      maxWidth: '95%',
      maxHeight: '90%'
    });
  });
});
