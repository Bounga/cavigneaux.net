setActiveMenu = ->
  items = $$("header nav ul li a")
  items.each (item) ->
    item.getParent("li").addClass("active") if item.pathname is document.location.pathname

showTweets = ->
  protocol = if /^http:/.test(document.location) then "http" else "https"
  script_tag = new Element "script",
    id: "twitter-wjs"
    src: protocol + "://platform.twitter.com/widgets.js"

  $(document.head).getElement('script').adopt script_tag

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
  if Browser.ie and Cookie.read('already_alerted_about_ie') is null
    Cookie.write 'already_alerted_about_ie', true
    if Locale.getCurrent().name is "fr-FR"
      alert("Je n'ai vraiment aucun plaisir à supporter IE pour mes sites personnels. Je ne le fais donc pas. Pensez à installer une alternatives telle que Firefox, Safari, Chrome ou Opera.")
    else
      alert("I really don't care about supporting IE for my personal websites. You should really consider switching to Firefox, Safari, Chrome or Opera.")

window.addEvent 'domready', ->
  setActiveLanguage()
  setActiveMenu()
  showTweets()
  showPosts()
  fuckIE()

window.addEvent "load", ->
  wrapStyledImages()
