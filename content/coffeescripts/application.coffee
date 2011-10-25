Twitter = new Class
  Implements: [Options,Events]

  options: {
    count: 3,
    sinceID: 1,
    link: true
  }

  initialize: (username,options) ->
    @setOptions(options)
    @info = {}
    @username = username

  linkify: (text) ->
    text.replace(/(https?:\/\/\S+)/gi,'<a href="$1">$1</a>').replace(/(^|\s)@(\w+)/g,'$1<a href="http://twitter.com/$2">@$2</a>').replace(/(^|\s)#(\w+)/g,'$1#<a href="http://search.twitter.com/search?q=%23$2">$2</a>')

  retrieve: ->
    new Request.JSONP({
      url: "http://twitter.com/statuses/user_timeline/#{@username}.json"
      data:
        count: @options.count
        since_id: @options.sinceID
      onRequest: @fireEvent('request')
      onComplete: (data) =>
        if @options.link
          item.text = @linkify(item.text) for item in data
        @fireEvent("complete", [data, data[0].user])
    }).send()

setActiveMenu = ->
  items = $$("header nav ul a")
  items.each (item) ->
    item.getFirst("li").addClass("active") if item.pathname is document.location.pathname 

showTweets = ->
  tweets_container = $("twitter")
  
  if tweets_container?
    twitter = new Twitter 'Bounga', {
      onComplete: (tweets, user) ->
        for tweet in tweets
          picture = user.profile_image_url.replace("\\",'')
          date = Date.parse(tweet.created_at).format("%x")
          via = tweet.source.replace("\\",'')
          new Element('div', {html: "<img src=\"#{picture}\" alt=\"#{user.name}\" /> <strong>#{user.name}</strong>#{tweet.text}<span>#{date} via #{via}</span>", 'class': 'item clear'}).inject('twitter')
    }
    try
      twitter.retrieve()
    catch error
      console.log "Can't get tweets" if console?

showPosts = ->
  posts_container = $("blog")
  
  if posts_container?
    new Request.JSONP({
      url: "http://friendfeed.com/api/feed/user?nickname=bounga&service=blog&num=3&format=json"
      onRequest: @fireEvent('request')
      onComplete: (resp) ->
        for item in resp.entries
          date = Date.parse(item.published).format("%x")
          new Element('div', {html: "<img src=\"/images/icons/feed.png\" alt=\"Blog\" /> <strong>#{item.service.name}</strong>#{item.title}<p><a href=\"#{item.link}\">Read more</a></p><span>#{date} by #{item.user.name}</span>", 'class': 'item clear'}).inject('blog')
    }).send()
    
setActiveLanguage = ->
  language = if Browser.ie then navigator.userLanguage else navigator.language
  locale = language[0...2]
  variant = language[-2..].toUpperCase()
  pref = [locale, variant].join("-")
  Locale.use(pref)
  
wrapStyledImages = ->
  $$("img.styled").each (item) ->
    new Element("span.image-wrap", {
      styles:
        position: "relative"
        display: "inline-block"
        background: "url('#{item.src}') no-repeat center center"
        width: "#{item.width}px"
        height: "#{item.height}px"
    }).wraps(item)

    item.setStyle "opacity", "0"
    
fuckIE = ->
  if Browser.ie
    if Locale.getCurrent().name is "fr-FR"
      alert("Je n'ai vraiment aucun plaisir à supporter IE pour mes sites personnels. Vous devriez sérieusement penser à installer Firefox, Safari, Chrome ou Opera qui sont de VRAIS navigateurs. IE est une blague qui ne supporte aucune des fonctionnalités modernes utilisées sur le Web.")
    else
      alert("I really don't care about suppporting IE for my personnal websites. You should really considerer switch to Firefox, Safari, Chrome or Opera which are REAL browsers. IE is a joke which doesn't support modern functionnalities.")
      
window.addEvent 'domready', ->
    setActiveLanguage()
    setActiveMenu()
    showTweets()
    showPosts()
    fuckIE()

window.addEvent "load", ->
  wrapStyledImages()