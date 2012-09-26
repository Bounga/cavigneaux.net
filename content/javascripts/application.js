(function() {
  var Twitter, fuckIE, setActiveLanguage, setActiveMenu, showPosts, showTweets, wrapStyledImages;

  Twitter = new Class({
    Implements: [Options, Events],
    options: {
      count: 3,
      sinceID: 1,
      link: true
    },
    initialize: function(username, options) {
      this.setOptions(options);
      this.info = {};
      return this.username = username;
    },
    linkify: function(text) {
      return text.replace(/(https?:\/\/\S+)/gi, '<a href="$1">$1</a>').replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>').replace(/(^|\s)#(\w+)/g, '$1#<a href="http://search.twitter.com/search?q=%23$2">$2</a>');
    },
    retrieve: function() {
      var _this = this;
      return new Request.JSONP({
        url: "http://twitter.com/statuses/user_timeline/" + this.username + ".json",
        data: {
          count: this.options.count,
          since_id: this.options.sinceID
        },
        onRequest: this.fireEvent('request'),
        onComplete: function(data) {
          var item, _i, _len;
          if (_this.options.link) {
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              item = data[_i];
              item.text = _this.linkify(item.text);
            }
          }
          return _this.fireEvent("complete", [data, data[0].user]);
        }
      }).send();
    }
  });

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
    var tweets_container, twitter;
    tweets_container = $("twitter");
    if (tweets_container != null) {
      twitter = new Twitter('Bounga', {
        onComplete: function(tweets, user) {
          var date, picture, tweet, via, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = tweets.length; _i < _len; _i++) {
            tweet = tweets[_i];
            picture = user.profile_image_url.replace("\\", '');
            date = Date.parse(tweet.created_at).format("%x");
            via = tweet.source.replace("\\", '');
            _results.push(new Element('div', {
              html: "<img src=\"" + picture + "\" alt=\"" + user.name + "\" /> <strong>" + user.name + "</strong>" + tweet.text + "<span>" + date + " via " + via + "</span>",
              'class': 'item clear'
            }).inject('twitter'));
          }
          return _results;
        }
      });
      try {
        return twitter.retrieve();
      } catch (error) {
        if (typeof console !== "undefined" && console !== null) {
          return console.log("Can't get tweets");
        }
      }
    }
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
        return alert("Je n'ai vraiment aucun plaisir à supporter IE pour mes sites personnels. Je ne le fais donc pas. Pensez à installer une alternatives telle que Firefox, Safari, Chrome ou Opera.");
      } else {
        return alert("I really don't care about suppporting IE for my personnal websites. You should really consider a switch to Firefox, Safari, Chrome or Opera.");
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
