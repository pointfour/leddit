function loadSubbredit(name) {
  console.log("loading...");
  const url = "https://api.reddit.com";
  return axios.get(`${url}/r/${name}`).then(res => {
    return res.data.data.children;
  });
}
function loadPost(path) {
  console.log(path);
  const url = "https://api.reddit.com";
  return axios.get(`https://api.reddit.com/${path}`).then(res => {
    return res.data;
  });
}
const postElem = data => {
  let postData = data.data;
  let post = elemMaker("div", { classList: "post" });
  let left = elemMaker("div", { classList: "left" });
  let right = elemMaker("div", { classList: "right" });
  post.appendChild(left);
  post.appendChild(right);
  let title = elemMaker("div", {
    classList: "title",
    innerText: postData.title
  });
  let time = elemMaker("div", {
    classList: "time grey",
    innerText: timeSince(postData.created_utc)
  });
  right.appendChild(title);
  right.appendChild(time);
  let upvote = elemMaker("div", { classList: "upvote vote" });
  let score = elemMaker("div", { innerText: postData.score });
  let downvote = elemMaker("div", { classList: "downvote vote" });
  left.appendChild(upvote);
  left.appendChild(score);
  left.appendChild(downvote);
  console.log(postData.title, title);
  post.addEventListener("click", e => {
    location.hash = `#${postData.permalink}`;
  });
  return post;
};
const voteWidgit = data => {
  let wrapper = elemMaker("div");
  let upvote = elemMaker("div", { classList: "upvote vote" });
  let score = elemMaker("div", { innerText: data.score });
  let downvote = elemMaker("div", { classList: "downvote vote" });
  wrapper.appendChild(upvote);
  wrapper.appendChild(score);
  wrapper.appendChild(downvote);
  return wrapper;
};
const commentElem = data => {
  let commentContainer = elemMaker("div", {
    classList: "comment-container"
  });
  app.postComments.appendChild(commentContainer);
  let left = elemMaker("div", {
    classList: "left"
  });
  let right = elemMaker("div", {
    classList: "right"
  });
  commentContainer.appendChild(left);
  commentContainer.appendChild(right);
  let informationDiv = elemMaker("div", {
    classList: "post-info"
  });
  let poster = elemMaker("a", {
    classList: "clean-link small",
    innerText: `u/${data.author} `,
    href: `https://api.reddit.com/u/${data.author}`
  });
  let postData = elemMaker("span", {
    classList: "grey small",
    innerText: `${data.score} points - ${timeSince(data.created_utc)}`
  });
  let aComment = elemMaker("div", {
    innerText: data.body
  });
  right.appendChild(informationDiv);
  informationDiv.appendChild(poster);
  informationDiv.appendChild(postData);
  right.appendChild(aComment);
  let replies = elemMaker("div");
  right.appendChild(replies);
  if (data.replies) {
    for (let i = 0; i < data.replies.data.children.length; i++) {
      let sumbcomment = commentElem(data.replies.data.children[i].data);
      replies.appendChild(sumbcomment);
    }
  }
  let plusbutton = elemMaker("div", {
    classList: "hidden plus-button",
    innerText: "+"
  });
  let upvote = elemMaker("div", { classList: "upvote vote" });
  let downvote = elemMaker("div", { classList: "downvote vote" });
  let downline = elemMaker("div", { classList: "downline" });
  downline.addEventListener("click", e => {
    if (aComment.style.display == "block" || aComment.style.display == "") {
      [aComment, replies, upvote, downvote, downline].forEach(elem => {
        elem.style.display = "none";
      });
      plusbutton.style.display = "block";
    } else {
      [aComment, replies, upvote, downvote, downline].forEach(elem => {
        elem.style.display = "block";
      });
      plusbutton.style.display = "none";
    }
    plusbutton.addEventListener("click", e => downline.click());
  });
  left.appendChild(upvote);
  left.appendChild(downvote);
  left.appendChild(downline);
  left.appendChild(plusbutton);
  return commentContainer;
};
const app = {
  updatePosts: posts => {
    app.posts = posts;
    console.log("updated posts");
  },
  posts: [],
  postData: [],
  views: {
    subreddit: {
      show: true,
      elem: document.getElementById("subreddit"),
      draw: () => {
        app.postsContainer.innerHTML = "";
        for (let i = 0; i < app.posts.length; i++) {
          app.postsContainer.appendChild(postElem(app.posts[i]));
        }
      }
    },
    post: {
      show: false,
      elem: document.getElementById("post"),
      draw: () => {
        app.postTextContainer.innerHTML = "";
        app.postVotes.innerHTML = "";
        let postData = app.postData[0].data.children[0].data;
        let subredditLink = elemMaker("a", {
          classList: "clean-link small textColor",
          href: `#/r/${postData.subreddit}`,
          innerText: `r/${postData.subreddit}`
        });
        let posterData = elemMaker("span", {
          classList: "small grey",
          innerText: ` - Posted by u/${postData.author} ${timeSince(
            postData.created_utc
          )}`
        });
        let title = elemMaker("div", {
          classList: "title",
          innerText: postData.title
        });
        let link = elemMaker("a", {
          innerText: postData.url,
          href: postData.url,
          target: "_blank"
        });
        app.postTextContainer.appendChild(subredditLink);
        app.postTextContainer.appendChild(posterData);
        app.postTextContainer.appendChild(title);
        app.postTextContainer.appendChild(link);
        let voteWrapper = voteWidgit({ score: postData.score });
        app.postVotes.appendChild(voteWrapper);
        let comments = app.postData[1].data.children;
        app.postComments.innerHTML = "";
        for (let i = 0; i < comments.length; i++) {
          let commentData = comments[i].data;
          app.postComments.appendChild(commentElem(commentData));
        }
      },
      init: data => {
        app.postComments.innerHTML = "";
        app.postVotes.innerHTML = "";
        app.postTextContainer.innerHTML = "";
        console.log("loading post...");
        loadPost(data).then(res => {
          app.postData = res;
          app.views["post"].draw();
        });
      }
    }
  },
  updateViews() {
    for (key in app.views) {
      if (app.views[key].show) app.views[key].elem.style.display = "block";
      else app.views[key].elem.style.display = "none";
    }
  },
  postsContainer: null,
  postTextContainer: null,
  postVotes: null,
  postComments: null,
  init: () => {
    app.postsContainer = document.getElementById("posts-container");
    app.postTextContainer = document.getElementById("post-text");
    app.postVotes = document.getElementById("post-votes");
    app.postComments = document.getElementById("post-comments");
    app.route(location.hash.slice(1, location.hash.length));
  },
  route: hash => {
    let sections = hash.slice(1, hash.length).split("/");
    console.log(sections);
    if (sections[0] == "r" && sections[2] == "comments") {
      app.views["post"].show = true;
      app.views["subreddit"].show = false;
      app.updateViews();
      app.views["post"].init(location.hash.slice(1, location.hash.length));
    } else if (sections[0] == "r" && sections[1] && !sections[2]) {
      for (key in app.views) {
        app.views[key].show = false;
        app.views.subreddit.show = true;
        app.updateViews();
      }
      loadSubbredit(sections[1]).then(data => {
        app.updatePosts(data);
        app.views.subreddit.draw();
      });
    } else {
      for (key in app.views) {
        app.views[key].show = false;
        app.views.subreddit.show = true;
        app.updateViews();
      }
    }
  }
};
app.init();

window.addEventListener("hashchange", e => {
  app.route(location.hash.slice(1, location.hash.length));
});
