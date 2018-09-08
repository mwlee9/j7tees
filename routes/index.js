var count = 0;

exports.home = function(req,res) {
  count++;
  res.render('home.ejs');
};

exports.about =function(req,res) {
  res.render('about.ejs', {count: count});
};

// exports.gallery = function(req,res) {
//   res.render('gallery.ejs');
// };

exports.contact = function(req,res) {
  res.render('contact.ejs');
};

exports.pricing = function(req,res) {
  res.render('pricing.ejs');
};

exports.contactForm = function(req,res) {
  res.render('contactForm.ejs');
};

exports.feedbackForm = function(req,res) {
  res.render('feedbackForm.ejs');
};


exports.notFound = function(req,res) {
  res.send('404');
};

exports.Search = function(req,res) {
  res.render('search.ejs');
};

exports.faq = function(req,res) {
  res.render('faq.ejs');
};

exports.guide = function(req,res) {
  res.render('guide.ejs');
};
