"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtn() : ''}
      ${showStar ? getStarHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function getDeleteBtnHTML() {
  return `
  <span class='trash-can'>
  <i class='fas fa-trash-alt'></i>
  </span>
  `;
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? 'fas' : 'far';
  return `
  <span class='star'>
  <i class='${starType}' fa-star'>
  </span>
  `;
}


function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function deleteStory(event) {
  console.debug('deleteStory', event);

  const $closestLi = $(event.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}

async function sumbitNewStory(event) {
  console.debug('sumbitNewStory', event);
  event.preventDefault();

  const title = $('#create-title').val();
  const url = $('#create-url').val();
  const author = $('#create-author').val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);

  $allStoriesList.prepend($story);

  $submitForm.slideUp('slow');
  $submitForm.trigger('reset');
}

$submitForm.on('submit', sumbitNewStory);


function putUserStoriesOnPage() {
  console.debug('putUserStoriesOnPage');

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append('<h6>No stories added by user</h6>');
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

function putFavoritesListOnPage() {
  console.debug('putFavoritesListOnPage');

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append('<h6>No Favorites</h6>');
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}


async function toggleStoryFavorite(event) {
  console.debug('toggleStoryFavorite', event);

  const $target = $(event.target);
  const $closestLi = $target.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass('fas')) {
    await currentUser.removeFavorite(story);
    $target.closest('i').toggleClass('fas far');
  } else {
    await currentUser.addFavorite(story);
    $target.closest('li').toggleClass('fas far');
  }
}

$storiesLists.on('click', '.star', toggleStoryFavorite);