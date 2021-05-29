'use strict';

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

/* [DONE] add class 'active' to the correct article */
selectedArticle.classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(){
    console.log('function generateTitleLinks is running');
    const titlesList = document.querySelector(optTitleListSelector);

/* remove contents of titleList */
    titlesList.innerHTML = '';

/* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(optArticleSelector);

    let html ='';

/* for each article */
    for (let article of articles){
        
        /* get the article id */
        const articleId = article.getAttribute('id');

        /* find the title element */
        const titleElement = article.querySelector(optTitleSelector);

        /* get the title from the title element */
        const articleTitle = titleElement.innerHTML;

        /* create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

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