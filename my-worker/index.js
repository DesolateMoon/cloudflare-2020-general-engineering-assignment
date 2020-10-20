//Delegates event request to handleRequest
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the  to either generate a JSON API or
 * to serve an HTML page
 * @param {Request} request
 * @returns { (JSON Response|HTMLRewriter) } Java Script Array as a JSON response or serves HTML page
 */
async function handleRequest(request) {

  /*########################
    Transformer Variables
    ########################
  */
  /*-- Variables for Link&SocialTransformer --*/
  var htmlBool      = { html: true } /* True if it will serve as HTML page */

  /*-- Variables for Profile&TitleTransformer --*/
  var name          = "Austin Nguyen" 

  /*-- Variables for BodyTransformer --*/
  var color = "bg-teal-800" 

  /*-- Variables for LinksTransformer --*/
  var resume        = { name: "Resume",     
                        url: "https://drive.google.com/file/d/1wC03ekIR7OkOjFP_Evqb3MHJQcvqoW09/view?usp=sharing"}
  var linkedIn      = { name: "LinkedIn",   
                        url: "https://www.linkedin.com/in/austinpn/"}
  var gitHub        = { name: "GitHub",     
                        url: "https://github.com/DesolateMoon/"}
  var links         = [ resume, linkedIn, gitHub ] /* varibles for JSON */
  var linksStr      = links.map((link) => JSON.stringify(link))  
  
  /*-- Variables for ProfileTransformer --*/
  var gitHubAvatar  = "https://avatars3.githubusercontent.com/u/27364224?s=460&u=12c0a2ebd892746404395bf6373ac5f055bfa546&v=4"
  
  /*-- Variables for SocialTransformer --*/
  var facebook      = { url: "https://www.facebook.com/austinnguyenishere/",  
                        svg: "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/facebook.svg" }
  var instagram     = { url: "https://www.instagram.com/austin.pn/",          
                        svg: "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg" }
  var socialLinks = [facebook, instagram]


  /*########################
    Other Variables
    ########################
  */
  /*-- Variables for Response --*/
  const url         = new URL(request.url)
  const path        = "/links"
  var   urlPath     = url.pathname
  const host        = "https://static-links-page.signalnerve.workers.dev"   

/*########################################
  ########################################
  Transformer Classes
  (Body, Links, Profile, Social, Title)
  ########################################
  ########################################
*/
  /* 
   * Class Transformer for the Body 
   * @class
  */
  class BodyTransformer {
    /** 
     * @constructs
     * @param {String} color background color of the website
     */
    constructor(color) {
      this.color = color
    }

    /**
     * Sets the background color of the website
     * @param {E} element 
     */
    async element(element) {
      element.setAttribute("class", this.color)
    }
  }


  /**  
   * Class Transformer for the div#links
   * @class
  */
  class LinksTransformer {
    /**
     * @constructs
     * @param {Array} links The link array
     */
    constructor(links) {
      this.links = links
    }

    /**
     * Sets element's content as the array
     * @param {E} element 
     */
    async element(element) {
      let content = this.links.map((link) => `<a href="${link.url}">${link.name}</a>`).join("\r\n")
      element.setInnerContent(content, htmlBool)
    }
  }


  /**  
   * Class Transformer for the div#profile
   * @class
  */
  class ProfileTransformer {
    /**
     * @constructs
     * @param {String} gitHubAvatar url of gitHub Avatar
     * @param {String} name my name which will be displayed under avatar
     */
    constructor(gitHubAvatar, name) {
      this.gitHubAvatar = gitHubAvatar
      this.name = name
    }
    
    /**
     * Handles 3 different tags
     * (div, img, h1)
     * @param {E} element 
     */
    async element(element) {
      if (element["tagName"] == "div") {
        element.setAttribute("style", "")
      }
      if (element["tagName"] == "img") {
        element.setAttribute("src", this.gitHubAvatar)
      }
      if (element["tagName"] == "h1") {
        element.setInnerContent(`${name}`)
      }
    }
  }


  /**  
   * Class Transformer for the div#social
   * @class
  */
  class SocialTransformer {
    /**
     * @constructs
     * @param {Array} socialLinks The social link array
     */
    constructor(socialLinks) {
      this.socialLinks = socialLinks
    }

    /**
     * Sets element's content as the array with corresponding SVG
     * @param {E} element 
     */
    async element(element) {
      element.setAttribute("style", "");
      let content = this.socialLinks.map((link) => `<a href="${link.url}">\r\n<img src="${link.svg}">\r\n</a>`).join("\r\n")
      element.setInnerContent(content, htmlBool)
    }
  }

  
  /**  
   * Class Transformer for the div#title
   * @class
  */
  class TitleTransformer {
    /**
     * @constructs
     * @param {String} title my name which will be displayed as tab name
     */
    constructor(title) {
      this.title = title
    }

    /**
     * Sets element's content as the title
     * @param {E} element 
     */
    async element(element) {
      element.setInnerContent(this.title)
    }
  }

/*########################################
  ########################################
  Main Response Logic
  (Refer to function doc for responses)
  ########################################
  ########################################
*/
  if (urlPath == path) {
    // returns Java Script Array as a JSON response
    return new Response(linksStr, { 
      headers: {
        "content-type": "application/json;charset=UTF-8"
        },
      })
  }
  
  //preparing to serve an HTML page
  const init = {    
    headers: {      
      "content-type": "text/html;charset=UTF-8",
      },  
    }

  const response = await fetch(host, init)
  
  //returns an HTML page using HTMLRewriter 
  return new HTMLRewriter()
    .on("div#links", new LinksTransformer(links))
    .on("div#profile, div#profile > *", new ProfileTransformer(gitHubAvatar, name))
    .on("div#social", new SocialTransformer(socialLinks))
    .on("title", new TitleTransformer(name))
    .on("body", new BodyTransformer(color))
    .transform(response)
  }