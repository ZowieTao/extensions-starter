export class twitterController {
  async login({ username, password }) {
    return true;
  }

  async publishTweet({ username, content, image }) {
    return "";
  }

  getHotTweets({ username, search }) {
    return [];
  }

  reply({ username, url, reply }) {}

  retweet({ username, url }) {}

  like({ username, url }) {}

  bookmark({ username, url }) {}

  follow({ username, url }) {}

  followers({ username }) {
    return 0;
  }

  account({ username }) {
    return 0;
  }
}
