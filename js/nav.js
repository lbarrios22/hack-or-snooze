"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(event) {
  console.debug("navAllStories", event);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navSubmitStoryClick(event) {
  console.debug('navSubmitStoryClick', event);
  hidePageComponents();
  $allStoriesList();
  $submitForm.show();
}

$navSubmitStory.on('click', navSubmitStoryClick);

function navFavoritesClick(event) {
  console.debug('navFavoritesClick', event);
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on('click', '#nav-favorites', navFavoritesClick);

function navMyStories(event) {
  console.debug('navMyStories', event);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on('click', '#nav-my-stories', navMyStories);

function navLoginClick(event) {
  console.debug("navLoginClick", event);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function navProfileClick(event) {
  console.debug('navProfileClick', event);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on('click', navProfileClick);

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
