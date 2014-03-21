(function() {
  var fuckIE, setActiveLanguage, setActiveMenu, showPosts, showTweets, wrapStyledImages;

  setActiveMenu = function() {
    var items;
    items = $$("header nav ul li a");
    return items.each(function(item) {
      if (item.pathname === document.location.pathname) {
        return item.getParent("li").addClass("active");
      }
    });
  };

  showTweets = function() {
    var protocol, script_tag;
    protocol = /^http:/.test(document.location) ? "http" : "https";
    script_tag = new Element("script", {
      id: "twitter-wjs",
      src: protocol + "://platform.twitter.com/widgets.js"
    });
    return $(document.head).getElement('script').adopt(script_tag);
  };

  showPosts = function() {
    var posts_container;
    posts_container = $("blog");
    if (posts_container != null) {
      return new Request.JSONP({
        url: "http://friendfeed.com/api/feed/user?nickname=bounga&service=blog&num=3&format=json",
        onRequest: this.fireEvent('request'),
        onComplete: function(resp) {
          var date, item, _i, _len, _ref, _results;
          _ref = resp.entries;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            date = Date.parse(item.published).format("%x");
            _results.push(new Element('div', {
              html: "<img src=\"/images/icons/feed.png\" alt=\"Blog\" /> <strong>" + item.service.name + "</strong>" + item.title + "<p><a href=\"" + item.link + "\">Read more</a></p><span>" + date + " by " + item.user.name + "</span>",
              'class': 'item clear'
            }).inject('blog'));
          }
          return _results;
        }
      }).send();
    }
  };

  setActiveLanguage = function() {
    var language, locale, pref, variant;
    language = Browser.ie ? navigator.userLanguage : navigator.language;
    locale = language.slice(0, 2);
    variant = language.slice(-2).toUpperCase();
    pref = [locale, variant].join("-");
    return Locale.use(pref);
  };

  wrapStyledImages = function() {
    return $$("img.styled").each(function(item) {
      new Element("span.image-wrap", {
        styles: {
          position: "relative",
          display: "inline-block",
          background: "url('" + item.src + "') no-repeat center center",
          width: "" + item.width + "px",
          height: "" + item.height + "px"
        }
      }).wraps(item);
      return item.setStyle("opacity", "0");
    });
  };

  fuckIE = function() {
    if (Browser.ie && Cookie.read('already_alerted_about_ie') === null) {
      Cookie.write('already_alerted_about_ie', true);
      if (Locale.getCurrent().name === "fr-FR") {
        return alert("Je n'ai vraiment aucun plaisir à supporter IE pour mes sites personnels. Je ne le fais donc pas. Pensez à installer une alternatives telle que Firefox, Safari, Chrome ou Opera.");
      } else {
        return alert("I really don't care about supporting IE for my personal websites. You should really consider switching to Firefox, Safari, Chrome or Opera.");
      }
    }
  };

  window.addEvent('domready', function() {
    setActiveLanguage();
    setActiveMenu();
    showTweets();
    showPosts();
    return fuckIE();
  });

  window.addEvent("load", function() {
    return wrapStyledImages();
  });

}).call(this);
