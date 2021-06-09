'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
  authorsList: Handlebars.compile(document.querySelector('#template-authors-list').innerHTML)
};

const opts = {
  title: {
    selector: '.post-title',
    listSelector: '.titles',
  },
  article: {
    selector: '.post',
    tagsSelector: '.post-tags .list',
    authorSelector: '.post-author',
  },
  tagsListSelector: '.tags.list',
  cloud: {
    classCount: 5,
    classPrefix: 'tag-size-',
  },
  authorsListSelector: '.list.authors',
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){

    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' atribute from the clicked link */

  const attributeOfElement = clickedElement.getAttribute('href');
  console.log(attributeOfElement);

  /* [DONE] find the correct article using the selector (value of 'href' atribute) */

  const selectedArticle = document.querySelector(attributeOfElement);
  console.log(selectedArticle);

  /* [DONE] add class 'active' to the correct article */
  selectedArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  console.log('function generateTitleLinks is running');
  const titlesList = document.querySelector(opts.title.listSelector);

  /* remove contents of titleList */
  titlesList.innerHTML = '';

  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(opts.article.selector + customSelector);

  console.log ('customSelector: ', customSelector);

  let html ='';

  /* for each article */
  for (let article of articles){
        
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);

    /* find the title element */
    const titleElement = article.querySelector(opts.title.selector);
    console.log(titleElement);

    /* get the title from the title element */
    const articleTitle = titleElement.innerHTML;
    console.log(articleTitle);

    /* create HTML of the link */
    // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    // first way:
    /* insert link into titleList */ 
    // titlesList.insertAdjacentHTML("beforebegin", linkHTML);

    // second way below:
    /* insert link into html variable */
    html = html + linkHTML;

    console.log(html);
  }
  titlesList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {

  const params = {
    max: 0,
    min: 999999,
  };

  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');

    params.max = Math.max(tags[tag], params.max);
    console.log(params.max);

    params.min = Math.min(tags[tag], params.min);
    console.log(params.min);
  }

  return params;
}

function calculateTagClass(count, params) {
  
  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor( percentage * (opts.cloud.classCount - 1) + 1 );


  return opts.cloud.classPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.article.selector);
  
  /* START LOOP: for every article: */
  for (let article of articles) {
  
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.article.tagsSelector);
  
    /* make html variable with empty string */
    let html = '';
       
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);
  
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);
  
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      console.log(tag);
      /* generate HTML of the link */

      // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      console.log(linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      // eslint-disable-next-line no-prototype-builtins
      if (!allTags.hasOwnProperty(tag)) {

        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
  
      /* END LOOP: for each tag */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opts.tagsListSelector);

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags */
    for (let tag in allTags) {

      /* [NEW] generate code of a link and add it to allTagsHTML */
      // const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li> ';
      // console.log('tagLinkHTML:', tagLinkHTML);
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });

      /* [NEW] END LOOP: for each tag in allTags */
    }

    /* [NEW] add html form allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
  }
}
generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('kliknięty element to:', clickedElement);
  console.log('this to:', this);

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href to:', href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log('tag:', tag);

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks){

    /* remove class active */
    activeTagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const clickedTagLinks = document.querySelectorAll('a[href="' + tag + '"]');

  /* START LOOP: for each found tag link */
  for (let clickedTagLink of clickedTagLinks) {


    /* add class active */
    clickedTagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function calculateAuthorsParams (allAuthors) {

  const params = {
    max: 0,
    min: 999999,
  };

  for (let articleAuthor in allAuthors) {

    console.log(articleAuthor + ' is used ' + allAuthors[articleAuthor] + ' times');

    params.max = Math.max(allAuthors[articleAuthor], params.max);
    console.log(params.max);

    params.min = Math.min(allAuthors[articleAuthor], params.min);
    console.log(params.min);
  }

  return params;
}

function generateAuthors () {

  /* [NEW] create a new variable allAuthors with an empty array */
  let allAuthors = {};

  const articles = document.querySelectorAll(opts.article.selector);

  for (let article of articles){

    const authorWrapper = article.querySelector(opts.article.authorSelector);

    let html = '';

    const articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor);

    // const linkHTML = 'by ' + '<a href ="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

    html = html + linkHTML;

    authorWrapper.innerHTML = html;

    // eslint-disable-next-line no-prototype-builtins
    if (!allAuthors.hasOwnProperty(articleAuthor)) {

      allAuthors[articleAuthor] = 1;

    } else {

      allAuthors[articleAuthor]++;
    }
  
    const authorList = document.querySelector(opts.authorsListSelector);

    const authorsParams = calculateAuthorsParams(allAuthors);
    
    console.log(authorsParams);

    const allAuthorsData = {authors: []};

    for (let author in allAuthors) {

      // const authorLinkHTML = '<li><a href ="#author-' + articleAuthor + '">' + articleAuthor + ' (' + (allAuthors[articleAuthor]) + ')' + '</a></li>';

      // console.log(articleAuthor);

      // console.log(authorLinkHTML);

      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });
    }
  
    authorList.innerHTML = templates.authorsList(allAuthorsData);
  }
}

generateAuthors();

function authorClickHandler (event) {

  event.preventDefault();

  const clickedElement = this;
  console.log(clickedElement);

  const href = clickedElement.getAttribute('href');
  console.log(href);

  const author = href.replace('#author-', '');
  console.log(author);

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(activeAuthorLinks);

  for (let activeAuthorLink of activeAuthorLinks){

    activeAuthorLink.classList.remove('active');
  }

  const clickedAuthorLinks = document.querySelectorAll('a[href="' + author + '"]');
  
  for (let clickedAuthorLink of clickedAuthorLinks){
 
    clickedAuthorLink.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {

  const links = document.querySelectorAll('a[href^="#author-"]');

  for (let link of links) {

    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();